export class ManualMigration1760986861562 {
  name = 'ManualMigration1760986861562';

  async up(qr) {
    // 1) PERSON
    await qr.query(`
      CREATE TABLE IF NOT EXISTS person (
        id SERIAL PRIMARY KEY,
        name varchar(250) NOT NULL,
        lastname varchar(250) NOT NULL,
        role_id int NOT NULL,                 -- 1=MEMBER, 2=LIBRARIAN (o lo que uses)
        member_number varchar(100),
        dni varchar(20)
      );
    `);
    await qr.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS uq_person_member_number
      ON person(member_number) WHERE member_number IS NOT NULL;
    `);

    // 2) BOOK
    await qr.query(`
      CREATE TABLE IF NOT EXISTS book (
        id SERIAL PRIMARY KEY,
        isbn  varchar(250) NOT NULL UNIQUE,
        title varchar(250) NOT NULL,
        author varchar(250) NOT NULL
      );
    `);

    // 3) COPY (FK -> BOOK)
    await qr.query(`
      CREATE TABLE IF NOT EXISTS copy (
        id SERIAL PRIMARY KEY,
        book_id int NOT NULL,
        CONSTRAINT fk_copy_book
          FOREIGN KEY (book_id) REFERENCES book(id) ON DELETE RESTRICT
      );
    `);

    // 4) LOAN (FK -> PERSON, COPY)
    await qr.query(`
      CREATE TABLE IF NOT EXISTS loan (
        id SERIAL PRIMARY KEY,
        date_from   timestamptz NOT NULL,
        date_to     timestamptz NOT NULL,
        returned_at timestamptz NULL,
        librarian_id int NULL,
        member_id    int NOT NULL,
        copy_id      int NOT NULL,
        CONSTRAINT fk_loan_librarian
          FOREIGN KEY (librarian_id) REFERENCES person(id) ON DELETE SET NULL,
        CONSTRAINT fk_loan_member
          FOREIGN KEY (member_id)    REFERENCES person(id) ON DELETE RESTRICT,
        CONSTRAINT fk_loan_copy
          FOREIGN KEY (copy_id)      REFERENCES copy(id)   ON DELETE RESTRICT
      );
    `);

    // 5) Índice único parcial (una copia no puede tener más de un préstamo activo)
    await qr.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS ux_loan_copy_active
      ON loan(copy_id) WHERE returned_at IS NULL;
    `);

    // 6) DEBT (FK -> PERSON, LOAN)
    await qr.query(`
      CREATE TABLE IF NOT EXISTS debt (
        id SERIAL PRIMARY KEY,
        amount numeric(10,2) NOT NULL,
        paid boolean NOT NULL DEFAULT false,
        member_id int NOT NULL,
        loan_id   int NULL,
        CONSTRAINT fk_debt_member
          FOREIGN KEY (member_id) REFERENCES person(id) ON DELETE RESTRICT,
        CONSTRAINT fk_debt_loan
          FOREIGN KEY (loan_id)   REFERENCES loan(id)   ON DELETE SET NULL
      );
    `);
  }

  async down(qr) {
    await qr.query(`DROP TABLE IF EXISTS debt;`);
    await qr.query(`DROP INDEX IF EXISTS ux_loan_copy_active;`);
    await qr.query(`DROP TABLE IF EXISTS loan;`);
    await qr.query(`DROP TABLE IF EXISTS copy;`);
    await qr.query(`DROP TABLE IF EXISTS book;`);
    await qr.query(`DROP INDEX IF EXISTS uq_person_member_number;`);
    await qr.query(`DROP TABLE IF EXISTS person;`);
  }
}