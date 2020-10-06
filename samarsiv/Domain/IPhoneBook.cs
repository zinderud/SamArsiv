using System.Collections.ObjectModel;

namespace Domain
{
    public interface IPhoneBook
    {
        void Load();

        ObservableCollection<Contact> GetAllContacts();
     
        ObservableCollection<ContactModel> GetAllContactsModels();

        void Delete(Contact SelectedItem); 
        void Delete(ContactModel contactModel);

        void Update();

        void Add(Contact contact); 
        void Add(ContactModel contactModel);

        void UpdateContactsModel(ObservableCollection<Contact> contacts);

        int CreateId(string form);

        void UpdateList(ObservableCollection<Contact> newContacts); 
        void UpdateList(ObservableCollection<ContactModel> newContactsModel);
    }
}
