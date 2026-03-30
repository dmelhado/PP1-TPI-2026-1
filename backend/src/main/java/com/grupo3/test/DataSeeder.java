package com.grupo3.test;

import com.grupo3.test.model.*;
import com.grupo3.test.service.EnvioService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final EnvioService envioService;

    public DataSeeder(EnvioService envioService) {
        this.envioService = envioService;
    }

    @Override
    public void run(String... args) {

        crearEnvio(
          "Falso 123", "Falso 456", "Operario X", 
          "Nombre Comprador", "12341234", 
          "Sin notas", 420, 
          TipoEnvio.NORMAL, 
          24, 
          20, 
          false, 
          false, 
          1
        );

        System.out.println("Envíos cargados correctamente");
    }

    private void crearEnvio(

        String direccionOrigen,
        String direccionDestino,
        String creadoPor,
        String nombreDestinatario,
        String telefonoDestinatario,
        String notasAdicionales,

        Integer distancia,
        TipoEnvio tipoEnvio,
        Integer ventanaHoras,
        Integer volumen,
        Boolean frio,
        Boolean fragil,
        Integer saturacion
        ) {

        Envio envio = new Envio();

        envio.setOrigen(direccionOrigen);
        envio.setDestino(direccionDestino);
        envio.setCreadoPor(creadoPor);
        envio.setDestinatarioNombre(nombreDestinatario);
        envio.setDestinatarioTelefono(telefonoDestinatario);
        envio.setNotasAdicionales(notasAdicionales);

        envio.setDistanciaEstimada(distancia);
        envio.setTipoEnvio(tipoEnvio);
        envio.setVentanaHoras(ventanaHoras);
        envio.setVolumen(volumen);
        envio.setFrio(frio);
        envio.setFragil(fragil);
        envio.setSaturacion(saturacion);

        envioService.crearEnvio(envio);
    }
}