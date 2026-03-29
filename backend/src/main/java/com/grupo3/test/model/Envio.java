package com.grupo3.test.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Envio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String trackingId;
    private String origen;
    private String destino;
    private String creadoPor;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaEstimadaEntrega;
    private Integer distanciaEstimada;

    @Enumerated(EnumType.STRING)
    private EstadoEnvio estadoEnvio;

    @Enumerated(EnumType.STRING)
    private TipoEnvio tipoEnvio;

    @Enumerated(EnumType.STRING)
    private Prioridad prioridadEnvio;

    // Info destinatario y Paquete en esta clase, pensado para implementación simulada y alcance reducido

    private String destinatarioNombre;
    private String destinatarioTelefono;

    private Double peso;
    private String dimensiones;
    private String restricciones;
    private String notasAdicionales;
}