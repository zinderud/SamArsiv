using System.Collections.Generic;
using System.Windows;
using System.Windows.Controls;


namespace UI
{
    public partial class AddEditDialog : Window, IAddEditView
    {
        List<TextBox> boxes;
        public AddEditDialog(AddEditViewModel viewModel)
        {            
            boxes = new List<TextBox> { };
            InitializeComponent();

            viewModel.CreateInterface(this);

            DataContext = viewModel;
        }   

        public void Warning(string line)
        {
            MessageBox.Show(line);
        }

        public List<TextBox> GetTextBoxes()
        {
            boxes.Clear();

            boxes.Add(textBoxName);
            boxes.Add(textBoxSurname);
            boxes.Add(textBoxNumber);
            boxes.Add(textBoxEmail);
            
            return boxes;
        }

        public void CloseDialog()
        {
            Close();
        }

        public Button GetButton()
        {
            return button;
        }

     
        private void textBoxName_TextChanged(object sender, TextChangedEventArgs e)
        {
            button.IsEnabled = true;
        }

        private void textBoxSurname_TextChanged(object sender, TextChangedEventArgs e)
        {
            button.IsEnabled = true;
        }

        private void textBoxNumber_TextChanged(object sender, TextChangedEventArgs e)
        {
            button.IsEnabled = true;
        }

        private void textBoxEmail_TextChanged(object sender, TextChangedEventArgs e)
        {
            button.IsEnabled = true;
        }
    }
}
