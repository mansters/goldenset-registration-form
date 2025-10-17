## Approach to Solving the Problem

The first step of the task is to analyze the requirements.

From the high-level perspective, it requires implementing a registration form for both frontend and backend. but the backend is for extra credit. So, I allocate around 70% of my time to the frontend and about 30% to the backend.

and then I analyze the detail of the frontend

- The requirement says that React and TypeScript should be used, as well as Next.js.
- but no component library is allowed; we have to implement it ourselves. There are a total of 5 components we need to implement:
  - `Row`/`Col`: for layout, 24 columns grid
  - `Button`: for reset and submit, should support different themes
  - `Input`: for all form fields, but needs to support password mode for `Password` and `Confirmation Password`, should be injected by the `Form` component, so the `value` and `onChange` are needed
  - `Alert`: to display the submit result
  - `Form`/`FormItem`: the idea comes from an open-source library called `Ant Design`, and the idea is:
    - There should be an instance created by hooks; we could use that instance to `set/get form value`, and `validate` as well.
    - The `FormItem` should automatically handle the logic of value change, validation
    - The validation should support required and custom validation. The custom validation should support async functions for the scenario of API invocation.

For the unit test part, I design the test case to describe what the input is and what the expected output or behavior is. and then pass the test case to the AI to generate the unit test. and check the unit test to see if anything goes wrong.

For the backend part, I've also doing the analysis first to find out what the task is, and what problem we should figure out before implement:

- There are total 2 interfaces that need to be implemented: `check the email has been registered or not` and `register the user`.
- The validation is also required. We should have zero trust for the input data even if the frontend has already checked. So every interface should be treated as independent and validated separately, even if they have logic dependencies.
- The password should not be stored in plain text, so it should be encrypted, but how?
- What if the user email has already exist in the DB? should I check before insert into DB or the DB can automatically hand that?

After the analysis, I doing the search for those question with AI's help.

- For the encryption method, I've asked GPT to recommend the popular library and then checked the document myself.
- For the email duplicate question, I have a discussion with GPT for a few rounds. The conclusion is it would be better to let DB handle that logic, because it can avoid the race condition. Imagine a scenario where two users register the same email simultaneously; it is possible that both users could get registered with the same email. But if you let DB handle that logic, the database enforces uniqueness atomically. And on top of that, it has better performance than a manual check, because the manual check spends 2 queries. So after that, I go check and search the relevant document for how to implement it [[1]](#reference-1)[[2]](#reference-2)[[3]](#reference-3)[[4]](#reference-4).

## How much AI did I use?

I am using AI for 3 parts:

1. to check if there are any logic flaws in my design. Ask AI, like `Hey, this is my design for the xxx. Could you check if there are any logic flaws by using critical thinking?`, instead of `Hey, do all the requirements for me`.
2. to generate the unit test by the test case that I write (as I mentioned for the previous section).
3. to give me a sight for the knowledge that I don't know so well (e.g. the backend part), then go back to point 1 to validate what I've found, and so on.

My point about AI is that it's a super powerful tool, but meanwhile, it's also a compulsive liar. I am not saying that we shouldn't use it; in fact, I recommend everyone embrace it, because it's really efficient in some cases and releases us from those repeatable things. But when we use it, do check the answer by ourselves, because it's still OUR responsibility for the code or the result. Make sure the thing is under OUR control! NOT AI.

## Where are the places you could do better?

### The extendable and more features of components

If implementing a real components library, there are a few things that should be considered.

- All components should support size, like `large`, `default`, `small`.
- should support customizable styles by using CSS variables
- document support

From the components' perspective, the enhancements of them are

- should support icons; for instance, using an icon when the switch shows/hides the status of password input instead of plain text
- Input:
  - should support prefix, suffix, and loading
  - the password component should extend from basic `Input`, and apply the show/hide feature by using the suffix.
- Form:
  - the verification should support different trigger times, like on `change`, `blur` or only when `submitting`.
  - should support nested form items
  - should support item group
  - currently when the internal store (value, touched, errors) changes, it bursts force to trigger all the component rerenders; it should trigger more precisely on the field level.
  - the validation should support debounce, especially for the validation that invokes an API, like email.
  - the async validation should provide feedback for user, for example, the loading status

### reuseable

some of components, utils or definition could be shared across the sub project, like the regular expression, interface definition

### more comprehensive unit test

The current unit test is based on function, not scenario, the ideal one should cover scenario as well.

### monitoring

in production env, the service should implement monitoring to check traffic and trigger alarm when detect malicious behavior. (e.g. implement IDS/IPS, and trigger alarm when under DDoS attack)

## Reference

<a id="reference-1">[1]</a> [PostgreSQL - UNIQUE Constraint - GeeksforGeeks](https://www.geeksforgeeks.org/postgresql/postgresql-unique-constraint/)

<a id="reference-2">[2]</a> [PostgreSQL: Documentation: 17: 5.5. Constraints](https://www.postgresql.org/docs/17/ddl-constraints.html#DDL-CONSTRAINTS-UNIQUE-CONSTRAINTS)

<a id="reference-3">[3]</a> [PostgreSQL: Documentation: 17: 34.8. Error Handling](https://www.postgresql.org/docs/17/ecpg-errors.html#ECPG-SQLSTATE-SQLCODE-ECPG-INFORMIX-DUPLICATE-KEY)

<a id="reference-4">[4]</a> [Check for UNIQUE constraint in Node-Postgres - Stack Overflow](https://stackoverflow.com/questions/71323001/check-for-unique-constraint-in-node-postgres)
