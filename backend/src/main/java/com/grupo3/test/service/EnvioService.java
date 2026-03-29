package com.grupo3.test.service;

import com.grupo3.test.model.*;
import com.grupo3.test.repository.EnvioRepository;
import com.grupo3.test.repository.HistorialEstadoRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Service
public class EnvioService {

    private final EnvioRepository envioRepo;
    private final HistorialEstadoRepository historialEstadoRepo;
    private final PrioridadService prioridadService;

    public EnvioService(EnvioRepository envioRepo, HistorialEstadoRepository historialEstadoRepo, PrioridadService prioridadService) {
        this.envioRepo = envioRepo;
        this.historialEstadoRepo = historialEstadoRepo;
        this.prioridadService = prioridadService;
    }

    public Envio crearEnvio(Envio envio) {
        envio.setTrackingId(generarTrackingId());
        envio.setEstadoEnvio(EstadoEnvio.PENDIENTE);
        envio.setFechaCreacion(LocalDateTime.now());

        Prioridad prioridad = prioridadService.predecirPrioridad(
                envio.getDistanciaEstimada() != null ? envio.getDistanciaEstimada() : 500,
                envio.getTipoEnvio() != null ? envio.getTipoEnvio() : TipoEnvio.NORMAL,
                // TODO: VER ventana horas, se asume en 24
                24,
                envio.getPeso() != null ? envio.getPeso().intValue() : 5,
                envio.getRestricciones() != null && envio.getRestricciones().contains("FRAGIL"),
                envio.getRestricciones() != null && envio.getRestricciones().contains("FRIO"),
                // TODO: VER saturación, por ahora asume
                "baja"
        );
        envio.setPrioridadEnvio(prioridad);

        return envioRepo.save(envio);
    }

    private String generarTrackingId() {
        long cantidad = envioRepo.count() + 1;
        return String.format("LT-%06d", cantidad);
    }

    public List<Envio> listarTodosEnvios() {
        return envioRepo.findAll();
    }

    public Optional<Envio> buscarEnvioPorTrackingID(String trackingId) {
        return envioRepo.findByTrackingId(trackingId);
    }

    public List<Envio> buscarEnvioPorEstado(EstadoEnvio estadoEnvio) {
        return envioRepo.findByEstadoEnvio(estadoEnvio);
    }

    public Optional<Envio> actualizarEstadoEnvio(String trackingId, EstadoEnvio nuevoEstado, String motivoCambio, String cambiadoPor) {
        
        return envioRepo.findByTrackingId(trackingId).map(envio -> {

            EstadoEnvio estadoAnterior = envio.getEstadoEnvio();

            envio.setEstadoEnvio(nuevoEstado);
            envioRepo.save(envio);

            HistorialEstado historial = new HistorialEstado();
            historial.setEnvio(envio);
            historial.setEstadoAnterior(estadoAnterior);
            historial.setEstadoNuevo(nuevoEstado);
            historial.setMotivoCambio(motivoCambio);
            historial.setCambiadoPor(cambiadoPor);
            historial.setFechaCambio(LocalDateTime.now());
            historialEstadoRepo.save(historial);

            return envio;
        });
    }

    public List<HistorialEstado> verHistorialEstado(String trackingId) {
        
        Envio envio = envioRepo.findByTrackingId(trackingId)
        .orElseThrow(() -> new RuntimeException("Envío no encontrado"));
        return historialEstadoRepo.findByEnvioIdOrderByFechaCambioDesc(envio.getId());
    }

}