import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../../../interfaces/task';

@Pipe({
  name: 'test',
})
export class TestPipe implements PipeTransform {
  transform(value: any, tasks: Record<string, Array<Task>>): unknown {
    let result = '';
    if (tasks.hasOwnProperty(value.toString())) {
      result =
        '' +
        tasks[value.toString()].length.toString() +
        (tasks[value.toString()].length === 1 ? ' Task' : ' Tasks');
    } else {
      result = '';
    }
    return result;
  }
}
