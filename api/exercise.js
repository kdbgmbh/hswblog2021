// Importieren von externen Abhängigkeiten
const express = require('express');

// Initialisieren der Express-App
const app = express();

// Registrieren des JSON-Parsers für den Request-Body,
// um auf req.body zuzugreifen zu können
app.use(express.json());

// Registrieren der Route von GET http://localhost:3000/app
app.get('/', function (req, res) {
    res.json({
        firstName: 'Paul',
        lastName: 'Hans',
        dateOfBirth: '1998-12-03',
        age: 12,
    });
});

// Registrieren der Route von GET http://localhost:3000/params
// Um params hinzuzufügen, kann ein Request auf einen URL wie bspw.
// http://localhost:3000/params?param1=1&someValue=string
// durchgeführt werden. Dabei wäre unter query dann folgendes Resultat
// vorzufinden: { param1: '1', someValue: 'string' }
app.get('/params', function (req, res) {
    console.log('params', req.params);
    console.log('query', req.query);
    res.json({ success: true });
});

// Demonstrieren einer Route mit params
// Beispiel: GET http://localhost:3000/entries/1234/images/345
app.get('/entries/:id/images/:imageid', function (req, res) {
    console.log('params', req.params); // Ausgeben der URL params
    console.log('query', req.query); // Ausgeben des queries
    res.json({ success: true });
});

// Registrieren der Route von POST http://localhost:3000/entries
app.post('/entries', function (req, res) {
    console.log(req.body);
    res.json({ success: true });
});

// Starten des Servers auf Port 3000
// URL / Erreichbarkeit des Servers unter: http://localhost:3000
app.listen(3000, function () {
    // Sobald der Server gestartet ist, wird diese Funktion aufgerufen
    // und wir bekommen die Information, dass der Server gestartet ist
    console.log('Started server');
});
