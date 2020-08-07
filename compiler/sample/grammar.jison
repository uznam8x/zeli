
/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex

%x GROUP

%%

\s+                   /* skip whitespace */
\w+                     { return 'WORD'; }
\-\-\>                  { return 'LINK'; }
<<EOF>>                 { return 'EOF'; }

/lex

/* operator associations and precedence */


%start expressions

%% /* language grammar */

expressions
    : { $$ = {} }
    | expressions syntax
;

syntax
    : WORD
        {console.log($1);}
    | LINK
    | EOF
;
/*
expressions
    : { $$ = [] }
    | vertax

vertax
    : string
    | string | WORD
        {
            console.log('WORD', $1, $2);
        }
    | MINUS
        {
            console.log('MINUS', $1, $2);
            
        }
    | LINK
        {
            console.log('LINK', $1, $2);
        }
    | AS
        {
            console.log('AS', $1, $2);
        }
    | AE
        {
            console.log('AE', $1, $2);
        }
    | COMMA
        {
            console.log('COMMA', $1, $2);
        }
    | GROUP
        {
            console.log('GROUP', $1, $2);
        }
    | EOF
        {
            console.log('EOF', $1, $2);
        }
    
    ;

string : WORD | COMMA | LINK
*/

