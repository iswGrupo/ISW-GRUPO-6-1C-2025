# EcoHarmony Park - Grupo 6
## Descripción

Este repositorio, **EcoHarmony Park**, contiene el desarrollo de una aplicación móvil para el bioparque "EcoHarmony Park", así como los artefactos de gestión del proyecto, como parte de la materia *Ingeniería y Calidad de Software* en la carrera de Ingeniería en Sistemas. La aplicación tiene como objetivo mejorar la experiencia de los visitantes mediante funcionalidades como mapas interactivos, horarios de alimentación, inscripción a actividades y compra de entradas con integración a Mercado Pago.

## Estructura del Proyecto

El repositorio está dividido en dos carpetas principales: `Producto` y `Proyecto`. A continuación, se detalla la estructura:

- **Producto/**  
  - **Arquitectura/**  
    - Eco_Pd_diagramaD_Diseño.drawio  
    - Eco_Pd_diagramaE_Despliegue.drawio  
    - Eco_Pd_diagramaE_Diseño.drawio  
    - Eco_Pd_diagramaE_Funcionalidad.drawio  
  - **CodigoFuente/**  
    - **Backend/**  
    - **Frontend/**
    - **Documento_Estilo_Codigo.pdf**  
  - **DiseñoInterfaz/**  
    - Eco_Pd_DI_InicioApp.drawio  
    - Eco_Pd_DI_Sesion.drawio  
  - **HistoriaUsuario/**  
    - Eco_Pd_HU.docx  
  - **Manuales/**  
    - Eco_Pd_Man_MA.docx  
    - Eco_Pd_Man_MD.docx  
    - Eco_Pd_Man_MU.docx  
  - **Requerimientos/**  
    - Eco_Pd_R_RF.docx  
    - Eco_Pd_R_RNF.docx  
  - **Test/**  
    - Eco_Pd_TestI_Parque.py  
    - Eco_Pd_TestU_Parque.py  

- **Proyecto/**  
  - **Cronograma/**  
    - Eco_Py_CR.calendar  
  - **ProductBacklog/**  
    - Eco_Py_Pb.txt  
  - **Sprints/**  
    - **SprintN0/**  
      - Eco_Py_Sprint_N0_Lead Time.docx  
    - **SprintN1/**  
      - Eco_Py_Sprint_N1_Lead Time.docx  

## Reglas de Nombrado

A continuación, se presentan las reglas de nombrado para los ítems de configuración del proyecto:

| **Nombre del ítem de configuración** | **Regla de nombrado**                              | **Ubicación**                     |
|--------------------------------------|---------------------------------------------------|-----------------------------------|
| Métricas del Sprint                 | Eco_Py_Sprint_N<NumeroDeSprint>_<NombreDeMétrica>.docx | /Proyecto/Sprint/Sprint_N#/       |
| Sprint Backlog                      | Eco_Py_Sprint_N<NumeroDeSprint>_Backlog.docx     | /Proyecto/Sprint/Sprint_N#/       |
| Manual de usuario                   | Eco_Pd_Man_<TipoDeManual>.docx                  | /Producto/Manuales                |
| Product Backlog                     | Eco_Py_Pb.txt                                   | /Proyecto/ProductBacklog          |
| Test Unitario                       | Eco_Pd_TestU_<NombreDescriptivo>.py             | /Producto/Test                    |
| Test de Integración                 | Eco_Pd_TestI_<NombreDescriptivo>.py             | /Producto/Test                    |
| Requerimientos                      | Eco_Py_R_<TipoDeRequerimiento>.docx            | /Producto/Requerimientos          |
| Diagrama de vista estática          | Eco_Pd_diagramaE_<TipoDeVista>.drawio           | /Producto/Arquitectura            |
| Diagrama de vista dinámica          | Eco_Pd_diagramaD_<TipoDeVista>.drawio           | /Producto/Arquitectura            |
| Cronograma                          | Eco_Py_CR.calendar                              | /Proyecto/Cronograma              |
| Servidor                            | Eco_Pd_CF_BK_Servidor.py                        | /Producto/CodigoFuente/Backend    |
| EstructuraBD                        | Eco_Pd_CF_BK_BD.sql                             | /Producto/CodigoFuente/Backend    |
| Diseño de Interfaz                  | Eco_Pd_DI_<NombreDescriptivo>.drawio            | /Producto/DiseñoInterfaz          |
| Historias de Usuario                | Eco_Pd_HU.docx                                  | /Producto/HistoriaUsuario         |

## Glosario

| **Abreviatura**         | **Significado**                                      |
|-------------------------|------------------------------------------------------|
| Eco                     | EcoHarmony Park                                      |
| Py                      | Proyecto                                             |
| Pd                      | Producto                                             |
| Man                     | Manual (Carpeta raíz)                                |
| MU                      | Abreviatura que corresponde a Manual de Usuario      |
| MD                      | Abreviatura que corresponde a Manual de Desarrollador|
| MA                      | Abreviatura que corresponde a Manual de Administrador|
| R                       | Requerimientos                                       |
| RF                      | Requerimientos Funcionales                           |
| RNF                     | Requerimientos No Funcionales                        |
| Pb                      | Product Backlog                                      |
| .py                     | Extensión de archivo de Python                       |
| .docx                   | Extensión de archivo de Word                         |
| .txt                    | Extensión de archivo de texto editable               |
| .sql                    | Extensión de archivo de base de datos SQL Server     |
| .drawio                 | Extensión de archivo de los diagramas                |
| .calendar               | Extensión de archivo de calendario                   |
| CR                      | Cronograma                                           |
| TestU                   | Test Unitario                                        |
| TestI                   | Test de Integración                                  |
| <TipoDeVista>           | Corresponde al tipo de vista que representa el diagrama (por ejemplo: vista de funcionalidad) |
| <TipoDeRequerimiento>   | Tipo de requerimiento representado en el archivo     |
| <NombreDescriptivo>     | Nombre que describe la funcionalidad                 |
| <NombreDeMétrica>       | Corresponde al tipo de métrica al que hace referencia (por ejemplo: Lead Time) |
| `<NumeroDeSprint>`        | Número asociado al sprint realizado. Es un valor que crece a medida que se realizan sprints |
| `<TipoDeManual>`        | Tipo de manual a describir                           |
| diagramaD               | Diagrama de la vista dinámica                        |
| diagramaE               | Diagrama de la vista estática                        |
| CF                      | Código fuente                                        |
| BK                      | Abreviatura para backend                             |
| BD                      | Base de datos                                        |
| DI                      | Diseño de Interfaz                                   |
| HU                      | Historia de usuario                                  |
