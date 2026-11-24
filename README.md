# Preflop Ranges

Visualizador web básico para consultar rangos preflop de poker.

## Funciones

- Mural responsive de rangos en 3 columnas.
- Modo día y noche.
- RNG de 0 a 100 con actualización automática configurable.
- Generación manual de un nuevo número.
- Rangos configurables mediante JSON.

## Ejecutar el proyecto

Desde la carpeta del proyecto, inicia un servidor local con Python:

```bash
python -m http.server 4173
```

Después abre en el navegador:

```text
http://localhost:4173/
```

## Añadir rangos

1. Coloca las imágenes en `assets/images/`.
2. Añade sus datos en `assets/ranges.json`.
3. Define para cada rango un `title`, su ruta `src` y un texto `alt`.

No se necesitan dependencias ni proceso de compilación.
