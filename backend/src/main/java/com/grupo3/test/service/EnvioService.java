package com.grupo3.test.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.grupo3.test.model.Envio;
import com.grupo3.test.model.EstadoEnvio;
import com.grupo3.test.model.HistorialEstado;
import com.grupo3.test.model.Prioridad;
import com.grupo3.test.model.TipoEnvio;
import com.grupo3.test.repository.EnvioRepository;
import com.grupo3.test.repository.HistorialEstadoRepository;

@Service
public class EnvioService {

  private final EnvioRepository envioRepo;
  private final HistorialEstadoRepository historialEstadoRepo;
  private final PrioridadService prioridadService;

  public EnvioService(EnvioRepository envioRepo,
      HistorialEstadoRepository historialEstadoRepo,
      PrioridadService prioridadService) {
    this.envioRepo = envioRepo;
    this.historialEstadoRepo = historialEstadoRepo;
    this.prioridadService = prioridadService;

    System.out.println("EnvioService cargado correctamente");
  }

  public Envio crearEnvio(Envio envio) {

    validarDireccion(envio.getOrigen(), "origen");
    validarDireccion(envio.getDestino(), "destino");

    // Defaults (cleaner)
    int distancia = Optional.ofNullable(envio.getDistanciaEstimada()).orElse(500);
    TipoEnvio tipo = Boolean.TRUE.equals(envio.getTipoEnvio())
        ? TipoEnvio.EXPRESS
        : TipoEnvio.NORMAL;

    envio.setTipoEnvio(tipo);

    int volumen = Optional.ofNullable(envio.getVolumen()).orElse(5);

    boolean fragil = envio.isFragil();
    boolean frio = envio.isFrio();

    int saturacion = envio.getSaturacion();
    int ventanaHoras = envio.getVentanaHoras();

    Prioridad prioridad = prioridadService.predecirPrioridad(
        distancia,
        tipo,
        ventanaHoras,
        volumen,
        fragil,
        frio,
        saturacion);

    envio.setTrackingId(generarTrackingId());
    envio.setEstadoEnvio(EstadoEnvio.PENDIENTE);
    envio.setFechaCreacion(LocalDateTime.now());
    envio.setPrioridadEnvio(prioridad);

    return envioRepo.save(envio);
  }

  private void validarDireccion(String direccion, String campo) {
    if (direccion == null || direccion.trim().length() < 6) {
      throw new IllegalArgumentException(
          "El campo '" + campo + "' debe tener al menos 6 caracteres");
    }
  }

  // ✅ Better tracking ID (no race condition)
  private String generarTrackingId() {
    return "LT-" + System.currentTimeMillis();
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

  public Optional<Envio> actualizarEstadoEnvio(String trackingId,
      EstadoEnvio nuevoEstado,
      String motivoCambio,
      String cambiadoPor) {

    return envioRepo.findByTrackingId(trackingId).map(envio -> {

      EstadoEnvio estadoAnterior = envio.getEstadoEnvio();
      validarTransicionEstado(estadoAnterior, nuevoEstado);

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

  private void validarTransicionEstado(EstadoEnvio estadoActual,
      EstadoEnvio nuevoEstado) {

    if (estadoActual == null || nuevoEstado == null) {
      throw new IllegalArgumentException("Estado actual o nuevo estado invalido");
    }

    if (estadoActual == nuevoEstado)
      return;

    if ((estadoActual == EstadoEnvio.EN_VIAJE
        || estadoActual == EstadoEnvio.ENTREGADO
        || estadoActual == EstadoEnvio.CANCELADO)
        && nuevoEstado == EstadoEnvio.PENDIENTE) {

      throw new IllegalStateException(
          "No se puede volver a PENDIENTE desde " + estadoActual);
    }

    if (estadoActual == EstadoEnvio.CANCELADO ||
        estadoActual == EstadoEnvio.ENTREGADO) {

      throw new IllegalStateException(
          "No se puede cambiar el estado de un envio " + estadoActual);
    }
  }

  public List<HistorialEstado> verHistorialEstado(String trackingId) {

    Envio envio = envioRepo.findByTrackingId(trackingId)
        .orElseThrow(() -> new RuntimeException("Envío no encontrado"));

    return historialEstadoRepo
        .findByEnvioIdOrderByFechaCambioDesc(envio.getId());
  }
}