import { Injectable } from '@angular/core';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import { DataAcessSettings } from './repositories/settings';
import { ClientEntity } from './entities/client.entity';
import { ArchiveEntity } from 'src/shared/entities/archive.entitiy';

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
      entities: [ArchiveEntity],
      synchronize: true,
      logging: 'all'
    };
    this.connection = createConnection(this.options);
  }
}
