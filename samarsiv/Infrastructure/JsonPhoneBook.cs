using System;
using System.IO;
using Newtonsoft.Json;
using System.Collections.ObjectModel;
using Domain;

namespace Infrastructure
{
    public class JsonPhoneBook : IPhoneBook
    {
        private ObservableCollection<Contact> contacts = new ObservableCollection<Contact> { };
     
        private ObservableCollection<ContactModel> contactsModel = new ObservableCollection<ContactModel> { };

        const string jsonPath = @"json\contactsList.json"; 

        public ObservableCollection<Contact> GetAllContacts()
        {
            return contacts;
        }
 
        public ObservableCollection<ContactModel> GetAllContactsModels()
        {
            return contactsModel;
        }

        public void Load()
        {
            if (!Directory.Exists("json"))
            {
                Directory.CreateDirectory("json");
            }

            if (File.Exists(jsonPath))
            {
                contacts = JsonConvert.DeserializeObject<ObservableCollection<Contact>>(File.ReadAllText(jsonPath));
            }
            else
            {
                File.WriteAllText(jsonPath, JsonConvert.SerializeObject(contacts));
            }

           
            UpdateContactsModel(contacts);
        }

        public void UpdateContactsModel(ObservableCollection<Contact> contacts)
        {
            contactsModel = new ObservableCollection<ContactModel> { };

            foreach(var c in contacts)
            {
                ContactModel temp = new ContactModel();

                temp.Id = c.Id;
                temp.D_no = c.D_no;
                temp.S_no = c.S_no;
                temp.Ad_soyad = c.Ad_soyad;
                temp.Tc = c.Tc;

               

                contactsModel.Add(temp);
            }
        }

      

        public void Update()
        {
            File.WriteAllText(jsonPath, JsonConvert.SerializeObject(contacts));          
        }

        public void UpdateList(ObservableCollection<Contact> contactList)
        {
            contacts = contactList;
            Update();
        }
 

        public void UpdateList(ObservableCollection<ContactModel> newContactsModel)
        {
            contactsModel = newContactsModel;
            Update();
        }

        public void Add(Contact contact)
        {
            contacts.Add(contact);
            
            Update();           
        }

        

        public void Add(ContactModel contactModel)
        {
            contactsModel.Add(contactModel);

            Update();
        }

        public void Delete(Contact selectedContact)
        {
            foreach (Contact c in contacts)
            {
                if (c == selectedContact)
                {
                    contacts.Remove(c);
                    break;
                }
            }
        }

     
        public void Delete(ContactModel contactModel)
        {
            contactsModel.Remove(contactModel);
            Update();
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

      

            return id;
        }
    }
}