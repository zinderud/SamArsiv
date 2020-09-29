import { Injectable } from '@angular/core';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import { DataAcessSettings } from './repositories/settings';
import { ClientEntity } from './entities/client.entity';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  public connection: Promise<Connection>;
  private readonly options: ConnectionOptions;

  constructor() {
    DataAcessSettings.initialize();
    this.options = {
      type: 'sqlite',
      database: DataAcessSettings.dbPath,
      entities: [ClientEntity],
      synchronize: true,
      logging: 'all'
    };
    this.connection = createConnection(this.options);
  }
}
