using System.Collections.Generic;
using System.Windows.Controls;

namespace UI
{
    public interface IAddEditView
    {
        List<TextBox> GetTextBoxes();

        void Warning(string line);

        Button GetButton();

   

        void CloseDialog();
    }
}
