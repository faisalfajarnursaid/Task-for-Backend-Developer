import arg from "arg";
import inquirer from "inquirer";
import { async } from "rxjs";
import { option, options } from "yargs";


function parseArgumentIntoOption(rawArgs) {
    const args = arg(
        {
            '--git' : Boolean,
            '--yes' : Boolean,
            '--install' : Boolean,
            '-g' : '--git',
            '-y' : '--yes',
            '-i' : '--install'
        },
        {
            argv : rawArgs.slice(2),
        }
    );
    return {
        skipPromt: args['--yes'] || false,
        git: args['--git'] || false,
        template: args._[0],
        runInstall: args['--install'] || false
    };
}

async function promtForMissingOption(args){
    const defaultTemplate = 'JavaScript';
    if (options.skipPromt) {
        return {
            ...options,
            template: option.template || defaultTemplate,
        };
    }

    const questions = [];
    if(!options.template ){
        questions.push({
            type : 'list',
            name: 'template',
            message: 'please chose which project template',
            choices: ['JavaScript', 'TypeScript'],
            default: defaultTemplate
        });
    }
    if(!options.git){
        questions.push({
            type: 'confirm',
            name: 'git',
            message: 'initialize git repository',
            default: false,
        });
    }
    const answer = await inquirer.prompt(questions);
    return {
       ...options,
       template: options.template || answer.template,
       git: options.git || answer.git
    }
}

export async function cli (args){
    let option = parseArgumentIntoOption(args); 
    options = await promtForMissingOption(options)
    console.log(option);
}