export const generateDockerCompose = (db: string): string | null => {
  if (db === "PostgreSQL") {
    return `version: '3.8'
services:
  db:
    image: postgres:alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: drizzle
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
`;
  }
  if (db === "MySQL") {
    return `version: '3.8'
services:
  db:
    image: mysql:8
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: drizzle
    volumes:
      - mysqldata:/var/lib/mysql

volumes:
  mysqldata:
`;
  }
  return null;
};
