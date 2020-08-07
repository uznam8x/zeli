/* lexical grammar */
%lex

%x OBJECT

%%
\s+                /* skip whitespace */
\n                  /* skip whitespace */

\w+                { return 'WORD'; }
[0-9]+                { return 'NUMBER'; }
\-\-\>                  { return 'LINK'; }
\-\|(.+)|\-\>                  { return 'LINK'; }

"{"(.+)"}"                 { return "OBJECT"; } 
"["                  {  return "ARRAY_S";  }
"]"                 { return "ARRAY_E"; } 
","                  { return "COMMA" }
":"                  { return "COLON" }
"="                  { return "EQUAL" }
(\r?\n)+              return 'NEWLINE';
\s                    return 'SPACE';
<<EOF>>            { return 'EOF'; };

/lex

%left "="

%start expressions

%% /* language grammar */

start: expressions;

expressions
    : {}
    | expressions syntax
;
syntax
    : WORD
        { console.log($$)}
    | LINK
        { console.log($$)}
    | COMMA
        { console.log($$)}
    | COLON
        { console.log($$)}
    | EQUAL OBJECT
        {console.log($2)}
    | ARRAY_S 
    | ARRAY_E 
    | EQUAL 
    | EOF
        { console.log($$)}
;

props
    : value
        { console.log($$)}
;

value
    : WORD COLON WORD
        { console.log($$)}
    | WORD COLON NUMBER
        { console.log($$)}
    | WORD COLON object
        { console.log($$)}
;

separator: NEWLINE | SEMI | EOF ;
/* 
object
    : WORD COLON argument
        { console.log($1)}
;
argument
    : WORD
    | argument WORD
    | argument NUMBER
    | argument object
    | argument COMMA
    | argument array
    | OBJECT_S
    | argument OBJECT_S
    | argument OBJECT_E
    | OBJECT_E
    
;
array
    : WORD
        //{console.log($1)}
    | ARRAY_E COMMA
        //{console.log($2)}
    |  WORD
        //{console.log($2)}
; */