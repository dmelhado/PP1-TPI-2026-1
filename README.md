# PP1-TPI-2026-1
Trabajo Practico Inicial de Proyecto Profesional I de la UNGS. Cursada 2026-1.

* **Backend:** Java + Spring Boot
* **Frontend:** React + Vite

## ¿Como ejecutar esto?
### 1. Requisitos

Instalar las siguientes dependencias:

* **Java JDK 17+**
* **Node.js 24 (LTS)**
* **npm** (incluido con Node.js)
* **Git**

Opcional pero recomendado:

* **Maven** o usar el wrapper (`mvnw`) incluido en el backend

### 2. Clonar el repositorio

```bash
git clone https://github.com/dmelhado/PP1-TPI-2026-1.git
cd PP1-TPI-2026-1.git
```
### 3. Ejecutar el Backend

```bash
cd backend
./mvnw spring-boot:run
```

En Windows:

```powershell
mvnw.cmd spring-boot:run
```

El backend se levantará por defecto en:

```
http://localhost:8080
```

### 4. Ejecutar el Frontend

```bash
cd frontend
npm install
npm run dev
```
La página web estará disponible en:

```
http://localhost:5173
```

## Notas
* Asegurarse de que el backend esté corriendo antes de usar el frontend.
* Verificar que las URLs de conexión (API) coincidan entre frontend y backend.
