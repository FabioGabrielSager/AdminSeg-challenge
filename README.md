# AdminSeg-challenge

## Requisitos.
- php >=5.5.9
- Composer
- MySQL
- Node.js ^18.13.0 || ^20.9.0
- npm
- (Optional pero recomendado) Docker

## Instalación
```
git clone https://github.com/FabioGabrielSager/AdminSeg-challenge.git
```
## Configurar y ejecutar cliente
1. Instalar dependencias:
    ```
    cd AdminSeg-challenge/angular-client/
    npm install
    ```
2. Ejecutar en modo desarrollo:
   ```
    npm start
   ```
## Configurar y ejecutar servidor
1. Instalar dependencias:
    ```
    cd AdminSeg-challenge/symfony-rest-api/
    composer install
    ```
2. Configurar conexión a base de datos.
   - En el archivo **symfony-rest-api/app/config/parameters.yml** confingurar los parametros:
       ```
        database_host: 
        database_port: 
        database_name: 
        database_user: 
        database_password: 
       ```
   - Validar sincronización de esquemas:
       ```
        php bin/console doctrine:scheme:validate 
       ```
   - (Opcional) si se trata de una base de datos vacía, para generar las tablas a partir de las entidades configuradas (code first) ejecute:
       ```
        php bin/console doctrine:scheme:update --force 
       ```
3. Ejecutar en modo desarrollo:
   ```
    php bin/console server:run
   ```

## Utilizar base de datos adjunta.
  ### Con docker:
  1. Iniciar un contenedor MySQL usando el siguiente comando:
     ```
     docker run --name adminsegChallengeDb -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root_pass -e MYSQL_DATABASE=product_api_db -e MYSQL_USER=adminseg -e MYSQL_PASSWORD=adminseg -d mysql:8 --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
     ```
  2. Importar el archivo de la base de datos (dump.sql) en el contenedor MySQL:
     ```
     docker cp database/dump.sql adminsegChallengeDb:/dump.sql
     docker exec -i adminsegChallengeDb mysql -u adminseg -padminseg product_api_db < /dump.sql
     ```
  3. Verificar que los datos han sido importados correctamente:
     ```
     docker exec -it adminsegChallengeDb mysql -u adminseg -padminseg -e "SHOW TABLES;" product_api_db
     ```
  ### Sin docker:
  1. Crear la base de datos:
     ```
     mysql -u root -p
     CREATE DATABASE product_api_db;
     EXIT;
     ```
  2. Importar el archivo de la base de datos (dump.sql) en la instancia de MySQL:
     ```
     mysql -u root -p product_api_db < path/to/dump.sql
     ```
  3. Verificar que los datos han sido importados correctamente:
     ```
     mysql -u root -p -e "SHOW TABLES;" product_api_db
     ```
## Credenciales de la base de datos adjunta:
| Username         | Email                       | Password         | Role      |
| -------------    | --------------------------- | ---------------- | --------- |
| admin            | admin@email.com             | imadmin          |  ADMIN    |
| phoneseller      | phoneseller@email.com       | phoneseller      |  USER     |
| furnitureseller  | furnitureseller@email.com   | furnitureseller  |  USER     |
| gamingseller     | gamingseller@email.com      | gamingseller     |  USER     |
| instrumentseller | instrumentseller@email.com  | instrumentseller |  USER     |
