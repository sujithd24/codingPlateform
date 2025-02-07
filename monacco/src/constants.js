export const LANGUAGE_VERSIONS = {

    c: "10.2.0",
    python: "3.10.0",
    java: "15.0.2",
    csharp: "6.12.0",
   
};

export const CODE_SNIPPETS = {
    c: `\n#include <stdio.h>\n\tint main() {\n\tprintf("Hello, World in C!");\n\treturn 0;\n}\n`,
    python: `\ndef greet(name):\n\tprint("Hello, "+ name + "!")\n\ngreet("Alex)\n`,
    java: `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\tSystem.out.println("Hello World");\n\t}\n}\n`,
    csharp:'using System;\n\nnamespace HelloWorld\n{\n\tclass Hello{\n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine("Hello World in C#");\n\t\t}\n\t}\n}\n',
   
};