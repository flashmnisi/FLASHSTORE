import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';

export class TemplateService {
  private templatePath = path.join(__dirname, '../../infrastructure/templates');

  private cache: Map<string, Handlebars.TemplateDelegate> = new Map();

  private loadTemplate(templateName: string) {
    if (this.cache.has(templateName)) {
      return this.cache.get(templateName)!;
    }

    const filePath = path.join(this.templatePath, `${templateName}.hbs`);

    const templateSource = fs.readFileSync(filePath, 'utf-8');

    const compiled = Handlebars.compile(templateSource);

    this.cache.set(templateName, compiled);

    return compiled;
  }

  render(templateName: string, data: any) {
    const template = this.loadTemplate(templateName);
    return template(data);
  }
}