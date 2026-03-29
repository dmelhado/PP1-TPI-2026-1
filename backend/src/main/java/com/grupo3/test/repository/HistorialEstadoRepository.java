package com.grupo3.test.repository;

import com.grupo3.test.model.HistorialEstado;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HistorialEstadoRepository extends JpaRepository<HistorialEstado, Long> {
    
    List<HistorialEstado> findByEnvioIdOrderByFechaCambioDesc(Long envioId);
    
}