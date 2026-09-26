# Hello Stages

Proyecto Node.js con dos funcionalidades, un conflicto de Git resuelto y tres entornos (desarrollo, prueba y producción) con Docker Compose.

## Requisitos

- Node.js 24 LTS
- Git
- Docker Desktop (o Docker Engine + Compose v2)

## Ejecución local

```
npm run dev
```

Disponible en http://localhost:3000

## Tests

```
npm test
```

## Stages con Docker

| Stage | Comando | Puerto |
|---|---|---|
| Desarrollo | `docker compose --profile dev up --build` | 3000 |
| Prueba | `docker compose --profile test up --build --abort-on-container-exit --exit-code-from app-test` | - |
| Producción | `docker compose --profile prod up --build -d` | 8080 |

Para detener cada stage: `docker compose --profile <dev|test|prod> down`

## Rutas

| Ruta | Descripción |
|---|---|
| `/` | Hello World con stage y versión |
| `/saludo?nombre=Ana` | Saludo personalizado |
| `/api/info` | Información del entorno y versión de Node |

## Integrantes

- Marcos Albornoz
- Cesar Segovia


## Respuestas a preguntas de reflexion:
1- Qué problema evita trabajar cada feature en una rama distinta?
- trabajar en ramas distintas evita que el trabajo de una funcionalidad o feature nueva interfiera con la otra mientras esta en desarrollo. cada rama puede probarse por separado y main recibe el codigo final. si una feature queda incompleta o tiene errores, no rompe con el resto del proyecto.
2- Por qué Git no pudo elegir automáticamente el valor final de PROJECT_NAME?
- porque las dos ramas partieron del mismo commit y modificaron la misma linea con valolres distintos. git puede combinar cambios en zonas diferentes, pero cuando la misma linea cambia en ambos lados no tiene forma de saber cual es la correcta. decidims no elegir un lado sino combinar ambos.
3- Qué evidencia aporta el stage de prueba antes de publicar una imagen?
- demuestra que las tres rutas responden lo esperado, y lo hace dentro de un contenedor con la misma version de node que se usa en prod, no solo en la maquina del programador. el contenedor termina con codigo de salida 0 si todos los test pasan, lo q sirve como criterio objetivo para decidir si la imagen se puede publicar.
4- Qué diferencias observaste entre el stage de desarrollo y el de producción?
- desarrollo monta la carpeta src como volumen y usa node --watch, asi que los cambios se reflejan sin reconstruir imagen. se expone en el puerto 3000. prod parte de una imagen limpia, no incluye la carpeta de tests, corre con un usuario sin privilegios, se reinicia sola si se cae y se expone en el puerto 8080m aunque internamente la app sigue escuchando en el 3000.
5- Qué información o secretos nunca deberían quedar dentro del repositorio o de la imagen?
- contaseñas, tokens de acceso, claves api, claves privadas ssh o de certificados y credenciales de bbdd. por eso el gitigone excluye .env y los archivos .secret.env. los archivos de env/ de este tp se pudieron versionar porque solo tienen el stage, la version y el puerto, no son datos sensibles.