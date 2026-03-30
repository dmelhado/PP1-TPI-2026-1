package com.grupo3.test.repository;

import com.grupo3.test.model.Envio;
import com.grupo3.test.model.EstadoEnvio;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface EnvioRepository extends JpaRepository<Envio, Long> {

  Optional<Envio> findByTrackingId(String trackingId);

  List<Envio> findByEstadoEnvio(EstadoEnvio estadoEnvio);

}