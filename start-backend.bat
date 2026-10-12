@echo off
title ShopSphere Campus Backend (Port 8080)
echo ========================================================
echo  Starting ShopSphere Campus Backend - Spring Boot 3
echo  Port: 8080
echo  Database: Embedded Persistent H2 (data/shopsphere_db)
echo  H2 Console: http://localhost:8080/h2-console
echo  API Docs:   http://localhost:8080/swagger-ui/index.html
echo ========================================================
cd /d "%~dp0backend"
mvn spring-boot:run
pause
