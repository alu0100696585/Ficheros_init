"use strict"; // Use ECMAScript 5 strict mode in browsers that support it

$(document).ready(function() {
   $("#fileinput").change(calculate);
});

$(document).ready(window.onload);

// main
function calculate(evt) {
  var f 
  
  if(evt.type != "drop")
    f = evt.target.files[0]; 
  else
    f = evt.dataTransfer.files[0];
  
  if (f) {
    var r = new FileReader();
    r.onload = function(e) { 
      var contents = e.target.result;
      
      var tokens = lexer(contents);
      var pretty = tokensToString(tokens);
      
      out.className = 'unhidden';
      
      if (window.localStorage) localStorage.initialinput = contents;
	initialinput.innerHTML = contents;
      if (window.localStorage) localStorage.finaloutput = pretty;
        finaloutput.innerHTML = pretty;
    }
    r.readAsText(f);
  } else { 
    alert("Failed to load file");
  }
}


function tokensToString(tokens) {
   var r = '';
   for(var i in tokens) {
     var t = tokens[i];
     var s = JSON.stringify(t, undefined, 2);
     s = _.template(tk.innerHTML, {token: t, match: s});
     r += s;
   }
   return '<ol>\n'+r+'</ol>';
}

function lexer(input) {  
  var blanks         = /^\s+/;
  //Expresion regular modificada para que acepte  ] siempre que esten escapados en el nombre de
  var iniheader      = /^\[((?:\\\]|[^\]\r\n])+)\]/;
  var comments       = /^[;#](.*)/;
  //Expresion modificada para permitir asignaciones multilinea.
  var nameEqualValue = /^([^=;\r\n]+)=((?:\\\s*\n|[^;\r\n])*)/;
  var any            = /^(.|\n)+/;

  var out = [];
  var m = null;

  while (input != '') {
    if (m = blanks.exec(input)) {
      input = input.substr(m.index+m[0].length);
      out.push({ type : 'blanks', match: m });
    }
    else if (m = iniheader.exec(input)) {
      input = input.substr(m.index+m[0].length);
      out.push({ type: 'header', match: m });
    }
    else if (m = comments.exec(input)) {
      input = input.substr(m.index+m[0].length);
      out.push({ type: 'comments', match: m });
    }
    else if (m = nameEqualValue.exec(input)) {
      input = input.substr(m.index+m[0].length);
      m[2] = m[2].replace(/\n/g, ' ');
      m[2] = m[2].replace(/\r/g, ' ');
      out.push({ type: 'nameEqualValue', match: m });
    }
    else if (m = any.exec(input)) {
      out.push({ type: 'error', match: m });
      input = '';
    }
    else {
      alert("Fatal Error!"+substr(input,0,20));
      input = '';
    }
  }
  return out;
}

//Añadir Local Store
window.onload = function() {
  // If the browser supports localStorage and we have some stored data
  if (window.localStorage && localStorage.initialinput) {
    document.getElementById("initialinput").innerHTML = localStorage.initialinput;
    document.getElementById("out").className = "none";
  }
  if (window.localStorage && localStorage.finaloutput) {
    document.getElementById("finaloutput").innerHTML = localStorage.finaloutput;
  }
};
