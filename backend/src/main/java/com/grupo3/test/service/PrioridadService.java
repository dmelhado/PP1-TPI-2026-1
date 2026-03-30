package com.grupo3.test.service;

import com.grupo3.test.model.Prioridad;
import com.grupo3.test.model.TipoEnvio;
import org.springframework.stereotype.Service;
import smile.classification.RandomForest;
import smile.data.DataFrame;
import smile.data.formula.Formula;
import smile.io.Read;
import org.apache.commons.csv.CSVFormat;
import java.io.*;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
public class PrioridadService {
  private RandomForest modelo;

  public PrioridadService() {
    try {
      InputStream modeloStream = getClass().getResourceAsStream("/priorityModel.ser");

      if (modeloStream == null) {
        throw new RuntimeException("No se encontró priorityModel.ser en resources");
      }

      try (ObjectInputStream ois = new ObjectInputStream(modeloStream)) {
        modelo = (RandomForest) ois.readObject();
      }

      System.out.println("Modelo ML cargado correctamente desde priorityModel.ser");

    } catch (Exception e) {
      throw new RuntimeException("Error cargando modelo ML", e);
    }
  }

  public Prioridad predecirPrioridad(int distanciaKm, TipoEnvio tipoEnvio,
      int ventanaHoras, int volumen,
      boolean fragil, boolean frio,
      int saturacionInt) {

    if (modelo == null) {
      System.err.println("Modelo ML no disponible, usando prioridad MEDIA por defecto");
      return Prioridad.MEDIA;
    }

    Object[] valores = {
        distanciaKm,
        tipoEnvio.getCode(),
        ventanaHoras,
        volumen,
        fragil ? 1 : 0,
        frio ? 1 : 0,
        saturacionInt
    };

    smile.data.Tuple tuple = smile.data.Tuple.of(modelo.schema(), valores);

    int prediccion = modelo.predict(tuple);

    return Prioridad.fromCode(prediccion);
  }

}
