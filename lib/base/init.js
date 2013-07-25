// base values object
var baseValues = {};

function baseInit() {
  // initialize database and default variables / values in base values object

  baseValues.db = openDatabase('mctdb1', '1.0', 'mctdb1', 2 * 1024 * 1024);

  var ts = Math.round((new Date()).getTime() / 1000);

  // Create table and insert one line
  baseValues.db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS player (option unique, value)');
    tx.executeSql('INSERT INTO player (option, value) VALUES ("time", ?)', [ts]);
  });
  baseValues.db.transaction(function (tx) {
    tx.executeSql('UPDATE player SET value = ? WHERE option = "time"', [ts]);
  });

  /*
   tx.executeSql('SELECT * FROM foo', [], function (tx, results) {
    var len = results.rows.length, i;
    for (i = 0; i < len; i++) {
      alert(results.rows.item(i).text);
    }
  });
  */

  var date = new Date(ts*1000);
  // hours part from the timestamp
  var hours = date.getHours();
  // minutes part from the timestamp
  var minutes = date.getMinutes();
  // seconds part from the timestamp
  var seconds = date.getSeconds();

}
