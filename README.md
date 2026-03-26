# Soy de Cristo México 2026 | Registro y compras para asistentes.   

Aplicación web desarrollada para gestionar el **registro de asistentes** al evento **Soy de Cristo México 2026** de las **Iglesias Ebenezer**.  
La plataforma permitirá que cada persona pueda **registrarse al evento** y, dentro del mismo flujo, también pueda realizar la **compra de productos oficiales**, como **playeras**, seleccionando **talla**, **cantidad** y otros detalles necesarios para su pedido.

---

## Descripción

Este proyecto tiene como objetivo centralizar en una sola aplicación el proceso de:

- Registro de asistentes al evento
- Captura de datos personales
- Selección de productos oficiales
- Elección de tallas y cantidades
- Resumen de compra
- Control y seguimiento de pedidos
- Integración futura con pagos en línea
- Administración interna desde un dashboard o CRM

La solución será construida con una arquitectura moderna y escalable utilizando:

- **Frontend:** React + TypeScript
- **Backend:** Node.js + TypeScript
- **Base de datos:** PostgreSQL
- **Estilos/UI:** Tailwind CSS
- **ORM:** Prisma
- **Validaciones:** React Hook Form + Zod

---

## Objetivo del proyecto

Facilitar el proceso de inscripción y compra para los asistentes del evento **Soy de Cristo México 2026**, brindando una experiencia simple, rápida y organizada, mientras se proporciona al equipo administrativo una base sólida para gestionar registros, pedidos y futuras confirmaciones de pago.

---

## Funcionalidades principales

### Módulo de registro
- Formulario de inscripción al evento
- Captura de datos personales del asistente
- Validación de campos obligatorios
- Confirmación de registro

### Módulo de compras
- Selección de playeras u otros productos oficiales
- Selección de talla
- Selección de cantidad
- Resumen del pedido
- Cálculo del total

### Módulo administrativo (futuro)
- Dashboard de registros
- Consulta de asistentes
- Consulta de pedidos
- Filtrado por estado de pago
- Exportación de información
- Gestión de inventario y tallas
- Confirmación de pagos
- Check-in para asistentes

---

## Tecnologías propuestas

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- React Hook Form
- Zod
- TanStack Query

### Backend
- Node.js
- Express o NestJS
- TypeScript
- Prisma ORM
- JWT para autenticación

### Base de datos
- PostgreSQL

### Integraciones futuras
- Stripe
- Mercado Pago
- Conekta
- Envío de correos
- Generación de QR
- Confirmaciones automáticas

---

## Estructura inicial del proyecto

```bash
soy-de-cristo-mexico-2026/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   └── main.tsx
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── modules/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── middlewares/
│   │   ├── config/
│   │   └── app.ts
│   ├── prisma/
│   └── package.json
│
├── README.md
└── LICENSE
