export interface UseObjectEvent<Schema> {
  object: Schema | undefined;
  error: Error | undefined;
}

// const { faker } = require("@faker-js/faker");
// const fs = require("fs/promises");

// async function csvToJson() {
//   const customers = await fs.readFile(
//     __dirname + "../../../public/customers.json",
//     "utf-8"
//   );

//   const customerNames = Array.from(JSON.parse(customers)).map(
//     (customer: any) => ({
//       ...customer,
//       "Customer Name": faker.person.fullName(),
//     })
//   );

//   await fs.writeFile(
//     __dirname + "../../../public/customers-1.json",
//     JSON.stringify(customerNames),
//     "utf-8"
//   );
// }

// csvToJson();
