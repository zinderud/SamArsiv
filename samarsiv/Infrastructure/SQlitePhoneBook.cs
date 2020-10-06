using System.Collections.ObjectModel;
using System;
using System.Data.SQLite;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using Dapper;
using System.Linq;
using Domain;

namespace Infrastructure
{
    public class SQlitePhoneBook : IPhoneBook
    {
        class ApplicationContext : DbContext
        {
            public ApplicationContext() : base("DefaultConnection")
            {           
            }
           
            public DbSet<Contact> Contacts { get; set; }

        }

        private string sqLitePath = @"db\database.db";

        private ApplicationContext dataBase = new ApplicationContext();

        private ObservableCollection<Contact> contacts = new ObservableCollection<Contact> { };
     
        private ObservableCollection<ContactModel> contactsModel = new ObservableCollection<ContactModel> { };

        public ObservableCollection<Contact> GetAllContacts()
        {
            Sync();
            return contacts;
        }

        public ObservableCollection<ContactModel> GetAllContactsModels()
        {
            return contactsModel;
        }

         

        public void Load()
        {
            if(!File.Exists(sqLitePath))
            {
                string baseName = sqLitePath;

                try
                {
                    SQLiteConnection.CreateFile(baseName);
                }
                catch(Exception)
                {
                    if (!Directory.Exists("db"))
                    {
                        Directory.CreateDirectory("db");
                        SQLiteConnection.CreateFile(baseName);
                    }
                }
                
                using (SQLiteConnection connection = new SQLiteConnection())
                {
                    connection.ConnectionString = "Data Source = " + baseName;
                    connection.Open();

                    using (SQLiteCommand command = new SQLiteCommand(connection))
                    {
                        string departs =
                       @"CREATE TABLE [Departaments] (
                    [Id] INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                    [Department] TEXT NOT NULL
                    );";
                        string contacts = @"CREATE TABLE [Contacts] (

    [Id]    INTEGER NOT NULL,
	[D_no]  TEXT,
	[S_no]   TEXT,
	[Ad_soyad]    TEXT,
	[Tc] TEXT,
	 
 

    PRIMARY KEY([Id] AUTOINCREMENT)
);";
                        command.CommandText = departs + contacts;
                        command.CommandType = System.Data.CommandType.Text;
                        command.ExecuteNonQuery();
                    }
                    connection.Close();
                }               
            }

            dataBase = new ApplicationContext();

            dataBase.Contacts.Load(); 

            dataBase.SaveChanges();

            Sync();

            UpdateContactsModel(contacts);
        }

        public void UpdateContactsModel(ObservableCollection<Contact> contacts)
        {
            contactsModel = new ObservableCollection<ContactModel> { };
            
            using (SQLiteConnection connection = new SQLiteConnection())
            {
                connection.ConnectionString = "Data Source = " + sqLitePath;
                connection.Open();

                var output = connection.Query<ContactModel>
    (
    @"SELECT Contacts.Id, Contacts.D_no, Contacts.S_no, Contacts.Ad_soyad, 
                                                    Contacts.Tc,   

	FROM Contacts
	
	 ", new DynamicParameters());

                List<ContactModel> temp = output.ToList();
                
                contactsModel = new ObservableCollection<ContactModel> { };
                contactsModel.Clear();
                foreach (var c in temp)
                {
                    contactsModel.Add(c);
                }

                connection.Close();
            }
        }

        public void Update()
        {
            dataBase.SaveChanges();

            Sync();
        }

        public void Delete(Contact selectedItem)
        {
            dataBase.Contacts.Remove(selectedItem);
            
            dataBase.SaveChanges();
            Sync();
            UpdateContactsModel(contacts);
        }

     

        public void Delete(ContactModel contactModel)
        {
            contactsModel.Remove(contactModel);
        }

        void Sync()
        {
            contacts.Clear();
             
            foreach (var set in dataBase.Contacts)
            {
                contacts.Add(set);
            }

           
            dataBase.SaveChanges();
        }

        public void Add(Contact contact)
        {
            dataBase.Contacts.Add(contact);

            dataBase.SaveChanges();
            Sync();
            UpdateContactsModel(contacts);
        }

       

        public void Add(ContactModel contactModel)
        {
            contactsModel.Add(contactModel);
        }

        public int CreateId(string form)
        {
            int id = 0;

            if (form == "contact")
            {
                if (contacts.Count == 0)
                    id = 0;
                else
                {
                    int[] idArr = new int[contacts.Count];
                    for (int i = 0; i < contacts.Count; i++)
                    {
                        idArr[i] = contacts[i].Id;
                    }

                    Array.Sort(idArr);

                    for (int i = 0; i < contacts.Count; i++)
                    {
                        if (idArr[i] != i)
                        {
                            return i;
                        }
                    }
                    id = contacts.Count;

                }
            }

             

            return id++;
        }

        public void UpdateList(ObservableCollection<Contact> newContacts)
        {
            contacts = newContacts;
            Update();
        }

       

        public void UpdateList(ObservableCollection<ContactModel> newContactsModel)
        {
            contactsModel = newContactsModel;
            Update();
        }
    }
}
