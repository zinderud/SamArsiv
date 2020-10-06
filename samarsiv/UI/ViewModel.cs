using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Collections.ObjectModel;
using System;
using Domain;
using Infrastructure;

namespace UI
{
    public class ViewModel : INotifyPropertyChanged
    {
        public string Form;
        public IPhoneBook PhoneBook = new XMLphoneBook();
        private readonly IMainView _view;

        public ViewModel(IMainView view)
        {
            _view = view;

            PhoneBook.Load();

            contacts = PhoneBook.GetAllContacts();
            ContactsModel = PhoneBook.GetAllContactsModels();
        }


        public Contact selectedContact;

        public ContactModel selectedContactModel;

        public ObservableCollection<Contact> contacts { get; set; }



        public ObservableCollection<ContactModel> contactModel;
        public ObservableCollection<ContactModel> ContactsModel
        {
            get { return contactModel; }
            set
            {
                contactModel = value;
                OnPropertyChanged("contactsModel");
            }
        }


        public ContactModel ContactToContactModel(Contact contact)
        {
            ContactModel contactModel = new ContactModel();

            contactModel.Id = contact.Id;
            contactModel.D_no = contact.D_no;
            contactModel.S_no = contact.S_no;
            contactModel.Ad_soyad = contact.Ad_soyad;
            contactModel.Tc = contact.Tc;



            return contactModel;
        }

        private RelayCommand addCommand;
        public RelayCommand AddCommand
        {
            get
            {
                return addCommand ??
                    (addCommand = new RelayCommand(obj =>
                    {
                        Form = "add";

                        AddEditViewModel viewModel = new AddEditViewModel(this);

                        _view.ShowAddEditDialog(this, viewModel);
                        PhoneBook.UpdateContactsModel(contacts);
                        ContactsModel = PhoneBook.GetAllContactsModels();

                    }));
            }
        }



        private RelayCommand removeCommand;
        public RelayCommand RemoveCommand
        {
            get
            {
                return removeCommand ??
                    (removeCommand = new RelayCommand(obj =>
                    {
                        Contact contact = obj as Contact;
                        {
                            if (selectedContactModel != null)
                                if (MainWindow.DeleteWarning())
                                {
                                    foreach (var c in contacts)
                                    {
                                        if (c.Id == SelectedContactModel.Id)
                                        {
                                            selectedContact = c;
                                        }
                                    }
                                    PhoneBook.Delete(selectedContact);
                                    contacts.Remove(selectedContact);
                                    PhoneBook.UpdateList(contacts);

                                    PhoneBook.Delete(selectedContactModel);
                                    ContactsModel.Remove(selectedContactModel);
                                    PhoneBook.UpdateContactsModel(contacts);
                                }
                        }
                    },
                    (obj) => contacts.Count > 0));
            }
        }




        private RelayCommand editCommand;
        public RelayCommand EditCommand
        {
            get
            {
                return editCommand ??
                    (editCommand = new RelayCommand(obj =>
                    {
                        if (selectedContactModel != null)
                        {
                            ContactModel temp = selectedContactModel;
                            Form = "edit";
                            AddEditViewModel viewModel = new AddEditViewModel(this);

                            foreach (var c in contacts)
                            {
                                if (c.Id == temp.Id)
                                {
                                    SelectedContact = c;
                                }
                            }
                            _view.ShowAddEditDialog(this, viewModel);



                            contacts = PhoneBook.GetAllContacts();
                            PhoneBook.UpdateContactsModel(PhoneBook.GetAllContacts());
                            ContactsModel = PhoneBook.GetAllContactsModels();
                            ContactsModel = PhoneBook.GetAllContactsModels();
                        }
                    }));
            }
        }




        public Contact SelectedContact
        {
            get { return selectedContact; }
            set
            {
                selectedContact = value;
                OnPropertyChanged("selectedContact");
            }
        }

        public ContactModel SelectedContactModel
        {
            get { return selectedContactModel; }
            set
            {
                selectedContactModel = value;
                OnPropertyChanged("selectedContactModel");
            }
        }



        public event PropertyChangedEventHandler PropertyChanged;
        public void OnPropertyChanged([CallerMemberName] string prop = "")
        {
            if (PropertyChanged != null)
                PropertyChanged(this, new PropertyChangedEventArgs(prop));
        }

        public void ContactsSearch(string l)
        {

            PhoneBook.UpdateContactsModel(contacts);
            ContactsModel = PhoneBook.GetAllContactsModels();

            if (l.Length == 0)
            {
                return;
            }

            else
            {
                ObservableCollection<ContactModel> temp = new ObservableCollection<ContactModel> { };

                foreach (var c in ContactsModel)
                {
                    if (Convert.ToString(c.Id).IndexOf(l) != -1 || c.D_no.ToLower().IndexOf(l.ToLower()) != -1 || c.S_no.ToLower().IndexOf(l.ToLower()) != -1 || c.Ad_soyad.ToLower().IndexOf(l.ToLower()) != -1 || c.Tc.ToLower().IndexOf(l.ToLower()) != -1)
                    {
                        temp.Add(c);
                    }
                    else continue;
                }

                ContactsModel = temp;
            }




        }
    }
}