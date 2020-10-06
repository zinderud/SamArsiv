using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace Domain
{
    public class Contact : INotifyPropertyChanged
    {
        private int id;
        private string d_no;
        private string s_no;
        private string ad_soyad;
        private string tc;
       

        public int Id
        {
            get { return id; }

            set { id = value; OnPropertyChanged("id"); }
        }

        public string D_no
        {
            get { return d_no; }

            set { d_no = value; OnPropertyChanged("d_no"); }
        }

        public string S_no
        {
            get { return s_no; }

            set { s_no = value; OnPropertyChanged("s_no"); }
        }


        public string Ad_soyad
        {
            get { return ad_soyad; }

            set { ad_soyad = value; OnPropertyChanged("ad_soyad"); }
        }

        public string Tc
        {
            get { return tc; }

            set { tc = value; OnPropertyChanged("tc"); }
        }

      

        public event PropertyChangedEventHandler PropertyChanged;
        public void OnPropertyChanged([CallerMemberName]string prop = "")
        {
            if (PropertyChanged != null)
                PropertyChanged(this, new PropertyChangedEventArgs(prop));
        }
    }
}
