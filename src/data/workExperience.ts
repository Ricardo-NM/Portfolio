export type Locale = "es" | "en";

export const workExperienceItems = [
  {
    logo: "/assets/experience-second.png",
    role: {
      es: "Desarrollador Full Stack",
      en: "Full Stack Developer",
    },
    company: "K-PUGA S.A. de C.V",
    date: {
      es: "Enero 2026 - Junio 2026",
      en: "January 2026 - June 2026",
    },
    details: {
      es: [
        "Diseñé y desarrollé una plataforma empresarial para centralizar la gestión operativa, documental y administrativa de procesos relacionados con el comercio exterior.",
        "Construí la arquitectura full stack de la plataforma utilizando React, Tailwind CSS, Node.js, Express y MySQL.",
        "Diseñé e integré APIs REST seguras con autenticación mediante JWT y control de acceso basado en roles.",
        "Incorporé comunicación en tiempo real con Socket.IO para facilitar la colaboración interna y el seguimiento de las operaciones.",
        "Administré el entorno de producción en un VPS Linux mediante NGINX, PM2 y HTTPS, aplicando configuraciones orientadas a la seguridad, disponibilidad y estabilidad del sistema.",
      ],
      en: [
        "Designed and developed an enterprise platform to centralize the operational, documentation, and administrative management of processes related to foreign trade.",
        "Built the full stack architecture of the platform using React, Tailwind CSS, Node.js, Express and MySQL.",
        "Designed and integrated secure REST APIs with authentication using JWT and role-based access control.",
        "Integrated real-time communication with Socket.IO to facilitate internal collaboration and tracking of operations.",
        "Managed the production environment on a Linux VPS using NGINX, PM2 and HTTPS, applying configurations focused on security, availability and system stability.",
      ],
    },
  },
  {
    logo: "/assets/experience-one.png",
    role: {
      es: "Desarrollador Full Stack",
      en: "Full Stack Developer",
    },
    company: "ArdabyTec",
    date: {
      es: "Mayo 2025 - Diciembre 2025",
      en: "May 2025 - December 2025",
    },
    details: {
      es: [
        "Desarrollé y mantuve aplicaciones web empresariales, implementando funcionalidades tanto en el frontend como en el backend.",
        "Diseñé e integré APIs para facilitar la comunicación entre sistemas internos y servicios externos.",
        "Administré bases de datos relacionales y no relacionales, realizando tareas de almacenamiento, consulta y gestión de información operativa.",
        "Participé en el levantamiento de requerimientos, análisis funcional y planificación de actividades bajo la metodología Scrum.",
        "Desplegué aplicaciones en entornos Windows Server mediante IIS y brindé soporte técnico para asegurar su correcto funcionamiento.",
        "Implementé soluciones que permitieron digitalizar procesos manuales, reducir tareas repetitivas y mejorar la eficiencia operativa.",
      ],
      en: [
        "Developed and maintained enterprise web applications, implementing features on both the frontend and backend.",
        "Designed and integrated APIs to facilitate communication between internal systems and external services.",
        "Managed relational and non-relational databases, performing tasks of storage, querying and management of operational information.",
        "Participated in requirements gathering, functional analysis and activity planning under the Scrum methodology.",
        "Deployed applications in Windows Server environments using IIS and provided technical support to ensure their proper functioning.",
        "Implemented solutions that allowed for the digitization of manual processes, reduction of repetitive tasks and improvement of operational efficiency.",
      ],
    },
  },
] as const;
