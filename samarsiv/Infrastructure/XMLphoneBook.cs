using System.Collections.ObjectModel;
using System.IO;
using System;
using System.Xml.Serialization;
using Domain;

namespace Infrastructure
{
    public class XMLphoneBook : IPhoneBook
    {
        private ObservableCollection<Contact> contacts = new ObservableCollection<Contact> { };

       

        private ObservableCollection<ContactModel> contactsModel = new ObservableCollection<ContactModel> { };

        const string xmlPathContacts = @"xml\contactsList.xml";
    

        public ObservableCollection<Contact> GetAllContacts()
        {
            return contacts;
        }

        

        public ObservableCollection<ContactModel> GetAllContactsModels()
        {
            return contactsModel;
        }

        public void UpdateContactsModel(ObservableCollection<Contact> contacts)
        {
            contactsModel = new ObservableCollection<ContactModel> { };

            foreach (var c in contacts)
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

    
        public void Load()
        {
            if (!Directory.Exists("xml"))
            {
                Directory.CreateDirectory("xml");
            }

            if (File.Exists(xmlPathContacts))
            {
                XmlSerializer xml = new XmlSerializer(typeof(ObservableCollection<Contact>));

                using (FileStream stream = new FileStream(xmlPathContacts, FileMode.OpenOrCreate))
                {
                    contacts = (ObservableCollection<Contact>)xml.Deserialize(stream);                    
                }
            }
            else
            {
                Update();
            }

            

            UpdateContactsModel(contacts);
        }

        public void Update()
        {
            File.Delete(xmlPathContacts);
            
            XmlSerializer xml = new XmlSerializer(typeof(ObservableCollection<Contact>));
            
            using (FileStream stream = new FileStream(xmlPathContacts, FileMode.OpenOrCreate))
            {
                xml.Serialize(stream, contacts);
            }

             

         
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


