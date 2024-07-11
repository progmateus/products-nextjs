import { Sequelize } from "sequelize-typescript";

class SequelizeWrapper extends Sequelize {
  constructor(opts: any) {
    super(opts);

    // @ts-expect-error refreshDynamic do PostgresConnectionManager
    this.connectionManager.refreshDynamicOids = () => {
      return Promise.resolve();
    };
  }
}

export default SequelizeWrapper;
