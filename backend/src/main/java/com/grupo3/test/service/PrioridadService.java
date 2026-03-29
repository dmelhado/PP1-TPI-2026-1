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
            InputStream modeloStream = getClass().getResourceAsStream("/model.ser");

            if (modeloStream != null) {
                ObjectInputStream modeloObjeto = new ObjectInputStream(modeloStream);
                modelo = (RandomForest) modeloObjeto.readObject();
                modeloObjeto.close();
                System.out.println("Modelo ML cargado desde model.ser");
            } else {
                System.out.println("No se encontró model.ser, entrenando nuevo modelo...");
                entrenarModeloYGuardar();
            }


        } catch (Exception e) {
            System.err.println("Error al cargar modelo: " + e.getMessage());
        }
    }

    private void entrenarModeloYGuardar() throws Exception {
        InputStream csvStream = getClass().getResourceAsStream("/dataset_envios.csv");
        if (csvStream == null) {
            throw new RuntimeException("No se encontró dataset_envios.csv en la carpeta resources"); 
        }

        // Lo guarda temporalmente para que smile pueda leerlo
        Path tempFile = Files.createTempFile("dataset_envios", ".csv");
        Files.copy(csvStream, tempFile, java.nio.file.StandardCopyOption.REPLACE_EXISTING);

        DataFrame df = Read.csv(tempFile.toString(), CSVFormat.DEFAULT.withFirstRecordAsHeader());

        df = df.factorize("tipo_envio", "saturacion","prioridad");

        System.out.println("Dataset cargado: " + df.size() + " filas");

        System.out.println("Entrenando modelo ML...");
        Formula formula = Formula.lhs("prioridad");
        modelo = RandomForest.fit(formula, df);

        System.out.println("Modelo entrenado, guardando en model.ser... Metrics: " + modelo.metrics());

        URL resourceUrl = getClass().getResource("/");
        if (resourceUrl != null) {
            String resourcePath = resourceUrl.getPath() + "model.ser";
            try (ObjectOutputStream oos = new ObjectOutputStream(
                    new FileOutputStream(resourcePath))) {
                oos.writeObject(modelo);
                System.out.println("Modelo guardado en: " + resourcePath);
            }
        }
    
        
        
        Files.deleteIfExists(tempFile);

    }

    public Prioridad predecirPrioridad(int distanciaKm, TipoEnvio tipoEnvio, 
                                        int ventanaHoras, int volumen, boolean fragil, boolean frio, String saturacion) {

            if (modelo == null) {
                System.err.println("Modelo ML no disponible, usando prioridad MEDIA por defecto");
                return Prioridad.MEDIA;
            }

            int tipoEnvioInt = tipoEnvio == TipoEnvio.EXPRESS ? 0 : 1;

            int saturacionInt = switch (saturacion.toLowerCase()) {
                case "alta" -> 0;
                case "media" -> 2;
                default -> 1; 
            };

            smile.data.type.StructType schema = modelo.schema();

            Object[] valores = {
                distanciaKm,
                tipoEnvioInt,
                ventanaHoras,
                volumen,
                fragil ? 1 : 0,
                frio ? 1 : 0,
                saturacionInt
            };

            smile.data.Tuple tuple = smile.data.Tuple.of(schema, valores);

            int prediccion = modelo.predict(tuple);

            return switch (prediccion) {
                case 0 -> Prioridad.ALTA;
                case 2 -> Prioridad.MEDIA;
                default -> Prioridad.BAJA; 
            };
                                        

    }


    }

    
    

