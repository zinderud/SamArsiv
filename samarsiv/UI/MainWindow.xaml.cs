using System.Windows;
using System.Collections.Generic;
using Domain;
using System.Text;
using System.Windows.Controls;
using System;

namespace UI
{
    public partial class MainWindow : Window, IMainView
    {
        Contact selectedContact;
        ContactModel selectedContactModel;

        ViewModel model;
        public MainWindow()
        {
            InitializeComponent();

            model = new ViewModel(this);
            DataContext = model;

        }

        public static bool DeleteWarning()
        {
            bool res;

            if (MessageBox.Show("Are you sure to delete this contact?", "Warning", MessageBoxButton.OKCancel) == MessageBoxResult.OK)
            {
                res = true;
            }

            else res = false;

            return res;
        }

        public static void Warning(string line)
        {
            MessageBox.Show(line);
        }

        public void Refresh()
        {
            contactsGrid.Items.Refresh();
        }


        void IMainView.ShowAddEditDialog(ViewModel viewModel, AddEditViewModel addEditView)
        {
            selectedContact = addEditView.selectedContact;

            selectedContactModel = addEditView.selectedContactModel;

            if (viewModel.Form == "add")
            {
                AddEditDialog addDialog = new AddEditDialog(addEditView);
                addDialog.Title = "Create";
                addDialog.button.Content = "Create";


                addDialog.ShowDialog();
            }



            else if (viewModel.Form == "edit")
            {
                AddEditDialog editDialog = new AddEditDialog(addEditView);
                editDialog.Title = "Edit";
                editDialog.button.Content = "Save";

                editDialog.textBoxName.Text = selectedContactModel.D_no;
                editDialog.textBoxSurname.Text = selectedContactModel.S_no;
                editDialog.textBoxNumber.Text = selectedContactModel.Ad_soyad;
                editDialog.textBoxEmail.Text = selectedContactModel.Tc;
                editDialog.button.IsEnabled = false;




                editDialog.ShowDialog();
            }


        }

        private void contactsSearch_TextChanged(object sender, System.Windows.Controls.TextChangedEventArgs e)
        {
            model.ContactsSearch(contactsSearch.Text);

        }

        public static string searchingForm = "contact";

        private void tabControl_SelectionChanged(object sender, System.Windows.Controls.SelectionChangedEventArgs e)
        {

            searchingForm = "contact";

        }



    }
}
