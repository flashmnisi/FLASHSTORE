import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';

export class TemplateService {
  private templatePath = path.join(__dirname, '../../infrastructure/templates');

  compile(templateName: string, data: any): string {
    const filePath = path.join(this.templatePath, `${templateName}.hbs`);

    const templateSource = fs.readFileSync(filePath, 'utf-8');

    const compiled = Handlebars.compile(templateSource);

    return compiled(data);
  }
}