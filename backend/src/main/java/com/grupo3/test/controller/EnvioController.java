package com.grupo3.test.controller;

import com.grupo3.test.model.*;
import com.grupo3.test.service.EnvioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java .util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/envios")
@CrossOrigin(origins = "http://localhost:5173") // Para el react

public class EnvioController {

    private final EnvioService envioService;

    public EnvioController(EnvioService envioService) {
        this.envioService = envioService;
    }

    @GetMapping
    public List<Envio> listarTodosLosEnvios() {
        return envioService.listarTodosEnvios();
    }

    @GetMapping("/{trackingId}")
    public ResponseEntity<Envio> obtenerDetalleEnvio(@PathVariable String trackingId) {
        return envioService.buscarEnvioPorTrackingID(trackingId)
            .map(ResponseEntity::ok)    
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Envio> crearEnvio(@RequestBody Envio envio) {
        Envio nuevoEnvio = envioService.crearEnvio(envio);
        return ResponseEntity.ok(nuevoEnvio);
    }

    @PatchMapping("/{trackingId}/estado")
    public ResponseEntity<Envio> cambiarEstadoEnvio( @PathVariable String trackingId, @RequestBody Map<String, String> body) {

        EstadoEnvio nuevoEstado = EstadoEnvio.valueOf(body.get("estado"));
        String motivoCambio = body.get("motivo");
        String cambiadoPor = body.get("usuario");

        return envioService.actualizarEstadoEnvio(trackingId, nuevoEstado, motivoCambio, cambiadoPor)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());

    }

    @GetMapping("/{trackingId}/historial")
    public ResponseEntity<List<HistorialEstado>> obtenerHistorialEstado(@PathVariable String trackingId) {
        List<HistorialEstado> historial = envioService.verHistorialEstado(trackingId);
        return ResponseEntity.ok(historial);
    }

    @GetMapping("/estado/{estado}")
    public List<Envio> porEstado(@PathVariable EstadoEnvio estado) {
    return envioService.buscarEnvioPorEstado(estado);
}

    
}