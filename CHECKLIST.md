# FEATURES
- [x] Spróbować usunąć dashboard
- [x] Obsługa autoryzacji
- [x] Wszystkie metody w serwisie do plików powinny dostawać kontroler
- [x] Kontrolka typu File
- [x] Kontrolka typu Time
- [x] Poprawić RWD menu
      https://merlosy.github.io/ngx-material-file-input/
- [x] Stronnicowanie na gridzie jak w type file (by nie znikało wszystko w chuj)
- [ ] Error handling w przypadku błedu pobrania danych. 
      Gdy nie da się pobrać danych w wielu miejscach jest ładowanie w nieskończoność. 
      Należy urzyć retry(3) po czym wyświetlić komunikat.
- [ ] Filtrowanie na gridzie
      
# BUGS
- [x] Loading spinner powoduje wariowanie na gridzie
- [ ] Chips menu nie powinien znikać po wybraniu opcji
- [ ] Chips zablokować możliwość dodawania tych samych rekordów
- [ ] Za dużo zapytań po wysłaniu formularza. Wykonuje się onChange
