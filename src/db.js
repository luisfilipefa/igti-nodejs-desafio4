const Sequelize = require("sequelize");

const sequelize = new Sequelize({
  dialect: "postgres",
  host: "postgres",
  port: 5432,
  database: "consulta_credito",
  username: "postgres",
  password: "docker",
  logging: false,
});

const clienteModel = (sequelize, DataTypes) => {
  const Cliente = sequelize.define("Cliente", {
    CPF: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    Nome: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  return Cliente;
};

const consultaModel = (sequelize, DataTypes) => {
  const Consulta = sequelize.define("Consulta", {
    Valor: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    NumPrestacoes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Juros: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    Montante: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    Prestacoes: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Consulta;
};

const productModel = (sequelize, Datatypes) => {
  const Product = sequelize.define("Product", {
    code: {
      type: Datatypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: Datatypes.STRING,
      allowNull: false,
    },
    price: {
      type: Datatypes.DOUBLE,
      allowNull: false,
    },
  });

  return Product;
};

const cliente = clienteModel(sequelize, Sequelize.DataTypes);
const consulta = consultaModel(sequelize, Sequelize.DataTypes);
const product = productModel(sequelize, Sequelize.DataTypes);

cliente.hasMany(consulta, { as: "Consultas" });
consulta.belongsTo(cliente);

module.exports = {
  cliente,
  consulta,
  product,
  sequelize,
};
