package com.grupo3.test;

import com.grupo3.test.model.*;
import com.grupo3.test.repository.EnvioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class DataSeeder implements CommandLineRunner {

    private final EnvioRepository repo;

    public DataSeeder(EnvioRepository repo) {
        this.repo = repo;
    }

    @Override 
    public void run(String... args) {
        if (repo.count() > 0) return;

        crearEnvio(
            "Juan Pérez", "+54 9 11 3279-5613", "Buenos Aires, Argentina", "Cordoba Capital, Argentina", 
            EstadoEnvio.EN_VIAJE, TipoEnvio.NORMAL, Prioridad.MEDIA, 3.5, "30x25x15 cm", null, "operador1"
        );

        crearEnvio(
            "Carlos Rodriguez Lopez", "+54 9 11 3279-7444", "Mendoza, Argentina", "Usuahia, Argentina", 
            EstadoEnvio.EN_VIAJE, TipoEnvio.EXPRESS, Prioridad.ALTA, 12.3, "60x40x30 cm", "FRAGIL", "operador2"
        );

        System.out.println("envíos cargados correctamente");
    }

    private void crearEnvio(String destinatario, String telefono, String direccionOrigen, String direccionDestino, EstadoEnvio estado, TipoEnvio tipo,
                            Prioridad prioridad, double peso, String dimensiones, String restricciones, String creadoPor) {

        Envio envio = new Envio();

        envio.setDestinatarioNombre(destinatario);
        envio.setDestinatarioTelefono(telefono);

        envio.setOrigen(direccionOrigen);
        envio.setDestino(direccionDestino);

        envio.setEstadoEnvio(estado);
        envio.setTipoEnvio(tipo);
        envio.setPrioridadEnvio(prioridad);

        envio.setPeso(peso);
        envio.setDimensiones(dimensiones);
        envio.setRestricciones(restricciones);

        envio.setCreadoPor(creadoPor);
        envio.setFechaCreacion(LocalDateTime.now());
        envio.setTrackingId(generarTrackingId());

        repo.save(envio);
        }

    private String generarTrackingId() {
        long cantidad = repo.count() + 1;
        return String.format("LT-%06d", cantidad);
    }
}