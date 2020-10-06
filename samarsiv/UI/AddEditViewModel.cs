using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Collections.ObjectModel;
using System.Collections.Generic;
using System.Windows.Controls;
using Domain;

namespace UI
{
    public class AddEditViewModel : INotifyPropertyChanged
    {
       
        List<TextBox> textBoxes;
        IAddEditView dialog;
        public ViewModel mainModel;
        IPhoneBook pbook;
        string form;

        public Contact selectedContact;
        public ContactModel selectedContactModel;

    
        

        public void CreateInterface(IAddEditView addEditView)
        {
            dialog = addEditView;
        }

        public AddEditViewModel(ViewModel viewModel)
        {  
            mainModel = viewModel;        
            
            pbook = viewModel.PhoneBook;            
            form = viewModel.Form;
            selectedContact = viewModel.SelectedContact;
         
            selectedContactModel = viewModel.SelectedContactModel;

    

            
        }

        private RelayCommand createCommand;
        public RelayCommand CreateCommand
        {
            get
            {
                return createCommand ??
                    (createCommand = new RelayCommand(obj =>
                    {
                 
                       
                        textBoxes = dialog.GetTextBoxes();
                        if (form == "add")
                        {
                           

                            Contact contact = new Contact();
                            ContactModel contactModel = new ContactModel();

                            contact.Id = pbook.CreateId("contact");

                            if (textBoxes[0].Text != "" || textBoxes[1].Text != "" || textBoxes[2].Text != "" || textBoxes[3].Text != "" )
                            {
                                contact.D_no = textBoxes[0].Text;
                                contact.S_no = textBoxes[1].Text;
                                contact.Ad_soyad = textBoxes[2].Text;
                                contact.Tc = textBoxes[3].Text;

                                



                                pbook.Add(contact);
                                pbook.Add(contactModel);                                
                                pbook.Update();                                
                                dialog.CloseDialog();

                            }

                            else
                            {
                                dialog.Warning("Fill the all rows");
                            }
                        }

                        else if (form == "edit")
                        {
                            ObservableCollection<Contact> updatedContacts = pbook.GetAllContacts();
                            ObservableCollection<ContactModel> updatedContacModel = pbook.GetAllContactsModels();

                            if (textBoxes[0].Text != "" || textBoxes[1].Text != "" || textBoxes[2].Text != "" || textBoxes[3].Text != "")
                            {
                                
                                for (int i = 0; i < pbook.GetAllContacts().Count; i++)
                                {
                                    if (updatedContacts[i].Id == selectedContactModel.Id)
                                    {
                                        updatedContacts[i].D_no = textBoxes[0].Text;
                                        updatedContacts[i].S_no = textBoxes[1].Text;
                                        updatedContacts[i].Ad_soyad = textBoxes[2].Text;
                                        updatedContacts[i].Tc = textBoxes[3].Text;




                                         



                                        pbook.UpdateList(updatedContacts);
                                        
                                        pbook.Update();
                                        dialog.CloseDialog();
                                    }
                                }
                            }

                            else
                            {
                                dialog.Warning("Fill the all rows");
                            }
                        }

                       
                       

                    }));
            }
        }

        public event PropertyChangedEventHandler PropertyChanged;
        public void OnPropertyChanged([CallerMemberName]string prop = "")
        {
            if (PropertyChanged != null)
                PropertyChanged(this, new PropertyChangedEventArgs(prop));
        }
    }
}
