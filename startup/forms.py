from django import forms


class SurfaceForm(forms.Form):
    A = forms.IntegerField(initial=3, label="Значение A",
                           widget=forms.TextInput(attrs={'class': 'form-control data-for-surface__field'}))
    B = forms.IntegerField(initial=1, label="Значение B",
                           widget=forms.TextInput(attrs={'class': 'form-control data-for-surface__field'}))
    C = forms.IntegerField(initial=5, label="Значение C",
                           widget=forms.TextInput(attrs={'class': 'form-control data-for-surface__field'}))
    D = forms.IntegerField(initial=-5, label="Значение D",
                           widget=forms.TextInput(attrs={'class': 'form-control data-for-surface__field'}))
    Xs = forms.IntegerField(initial=-50, label="Начальное значение X",
                            widget=forms.TextInput(attrs={'class': 'form-control data-for-surface__field'}))
    Xf = forms.IntegerField(initial=50, label="Конечное значение X",
                            widget=forms.TextInput(attrs={'class': 'form-control data-for-surface__field'}))
    Ys = forms.IntegerField(initial=-70, label="Начальное значение Y",
                            widget=forms.TextInput(attrs={'class': 'form-control data-for-surface__field'}))
    Yf = forms.IntegerField(initial=70, label="Конечное значение Y",
                            widget=forms.TextInput(attrs={'class': 'form-control data-for-surface__field'}))
    N = forms.IntegerField(initial=100, label="Количество делений",
                           widget=forms.TextInput(attrs={'class': 'form-control data-for-surface__field'}))
