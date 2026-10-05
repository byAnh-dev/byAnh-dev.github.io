// Design fixtures only. These are not published, owner-authored articles.
export const articles = [
  {
    slug: 'a-task-is-more-than-a-prompt',
    title: 'A task is more than a prompt',
    topic: 'AI workflows',
    cover: 'prompt',
    summary: 'A few notes on the work that happens before asking an AI to build something.',
    sections: [
      { paragraphs: [
        'An empty prompt box makes every task look like a writing problem. Find the right words, send them, and wait for the result. But deciding what to ask is often the larger piece of work.',
        'Imagine asking an assistant to improve a page. That could mean shortening the copy, making the navigation clearer, or fixing a layout that breaks on a phone. A polished result can still solve the wrong problem.'
      ] },
      { heading: 'Name the thing that should change', paragraphs: [
        'Start with an observation someone else could check. The title wraps awkwardly on a narrow screen. A reader cannot tell which card opens an article. There is no way back to the collection. Each observation gives the task a useful boundary.',
        'Then describe what a successful result would let someone do. For a writing gallery, that might be choosing a topic, opening a post, and returning to the same collection. A screenshot can help explain the visual direction, but it cannot explain that whole interaction.'
      ] },
      { quote: 'The useful question is what someone should be able to do when the work is finished.' },
      { heading: 'Leave room to discover the answer', paragraphs: [
        'A task does not need to prescribe every implementation detail. It needs enough context to explain the goal and enough constraints to rule out unwanted results. The person or agent doing the work still needs room to investigate.',
        'The first result is a chance to check the original question. If it misses the point, revise the task with the specific thing that was missing. That observation is more useful than another request to make it better.'
      ] }
    ]
  },
  {
    slug: 'give-the-agent-a-finish-line',
    title: 'Give the agent a finish line',
    topic: 'AI workflows',
    cover: 'finish',
    summary: 'Thinking about what "done" means before handing over a task.',
    sections: [
      { paragraphs: [
        'A request to keep improving something has no obvious stopping point. There is always another interaction to polish or another piece of code to rearrange. An agent needs a way to tell whether the requested work is complete.',
        'A finish line can be ordinary and concrete. The page loads. Every card leads to the right article. The text remains readable on a phone. These are things to observe, not adjectives to agree with.'
      ] },
      { heading: 'Describe a complete trip through the feature', paragraphs: [
        'For a gallery, checking the cards is only the beginning. Follow a card into the article, read past the cover, and find the way back. Repeat the trip using the keyboard. The destination matters as much as the first screen.',
        'Writing that trip down before implementation makes review easier. It gives both the builder and reviewer the same actions to try, while leaving the visual details open to discussion.'
      ] },
      { heading: 'Make the remaining work visible', paragraphs: [
        'A design preview may have a working reading page and sample content. That is a useful result, but it is different from a published collection. The preview should say which content is illustrative so a working interaction does not imply that the writing is ready.',
        'Completion becomes easier to discuss when the result and its limits are visible together. The next task can then begin with something more precise than a request to continue.'
      ] }
    ]
  },
  {
    slug: 'before-automating-do-it-once',
    title: 'Before automating, do it once',
    topic: 'Build logs',
    cover: 'steps',
    summary: 'A manual pass can reveal the decisions hidden inside a repetitive task.',
    sections: [
      { paragraphs: [
        'A task can sound repetitive until someone tries to write down its steps. Collect the files, clean the information, and save the result. Each phrase can hide decisions that are easy to overlook.',
        'Walking through one example is a way to find those decisions. Which file counts as the latest version? What happens when a field is blank? Is an unexpected value a mistake or something worth preserving?'
      ] },
      { heading: 'Write down the pauses', paragraphs: [
        'The useful notes are often the moments when the work stops. A filename needs interpretation. Two records disagree. A result looks plausible but needs a second look. These pauses show where a workflow needs an explicit rule or a person to make a decision.',
        'The point is not to make the manual process perfect. It is to gather a small example that exposes the shape of the work, including the inconvenient parts.'
      ] },
      { quote: 'A pause in the manual process is a question the automation will eventually have to answer.' },
      { heading: 'Keep the example', paragraphs: [
        'Save the input and the expected result together. They give the first automated version something concrete to reproduce. When a new case behaves differently, add it to the collection instead of quietly changing the original example.',
        'That leaves a record of what the workflow is meant to handle. It also makes it easier to explain which decisions still belong to a person.'
      ] }
    ]
  },
  {
    slug: 'the-small-experiment-comes-first',
    title: 'The small experiment comes first',
    topic: 'Experiments',
    cover: 'experiment',
    summary: 'An idea for keeping the first test small enough to teach you something.',
    sections: [
      { paragraphs: [
        'A new idea tends to arrive with a whole product attached. There could be a dashboard, a history view, settings, and a polished onboarding flow. Yet the question underneath might be much smaller. Can this approach handle one real example?',
        'That question deserves a test before the surrounding interface becomes a project of its own. The first experiment only needs to produce enough evidence to choose the next step.'
      ] },
      { heading: 'Choose the uncertain part', paragraphs: [
        'Pick the assumption that would change the plan if it proved false. Maybe the input is harder to interpret than expected. Maybe the result needs more checking than the workflow can support. A test of the easy part will not answer either question.',
        'Write down the input, the result you expect, and what would count as a failure. A short note is enough. It helps separate what the experiment actually showed from what you hoped it would show.'
      ] },
      { heading: 'Let the result change the plan', paragraphs: [
        'A failed example can make the project more specific. It may reveal a useful boundary or suggest that a smaller feature is the better place to begin. The experiment has done its job if the next decision is clearer.',
        'Keep the result beside the original question. Later, that pair will be easier to learn from than a polished explanation written after the outcome was already known.'
      ] }
    ]
  },
  {
    slug: 'keep-the-failed-attempts',
    title: 'Keep the failed attempts',
    topic: 'Build logs',
    cover: 'attempts',
    summary: 'Why a useful build log has room for the version that did not work.',
    sections: [
      { paragraphs: [
        'A finished demo makes the path to it look tidy. The feature works, the interface makes sense, and the explanation follows a clear sequence. The discarded attempts rarely fit into that story.',
        'But a build log has a different job. It can preserve the decisions that would otherwise disappear, including the ideas that looked reasonable and turned out to be wrong.'
      ] },
      { heading: 'Keep enough to reproduce the surprise', paragraphs: [
        'A note that says an approach failed is hard to use later. Keep the example that exposed the problem and describe what happened. If a change fixed it, record that change alongside the result.',
        'There is no need to save every intermediate thought. Keep the moments that changed the direction of the work. A screenshot, a small input, or a short observation can be enough.'
      ] },
      { heading: 'Separate observation from explanation', paragraphs: [
        'What happened and why it happened are different things. The observation may be clear while the explanation remains a guess. Writing them separately keeps a tentative interpretation from becoming an unquestioned fact.',
        'Later attempts can revisit that guess. A build log becomes useful when it helps someone ask a better question, including the person who wrote it.'
      ] }
    ]
  },
  {
    slug: 'what-belongs-in-the-context',
    title: 'What belongs in the context?',
    topic: 'Experiments',
    cover: 'context',
    summary: 'A working question about giving an assistant the information a task actually needs.',
    sections: [
      { paragraphs: [
        'When an assistant misses something, adding more background is an obvious response. Another document, another example, another explanation of the project. It is less obvious which part of that material will help with the next decision.',
        'One way to explore the question is to begin with the task itself. What must the assistant know to act? Which details explain the goal, and which details only describe how the project arrived here?'
      ] },
      { heading: 'Try a smaller packet', paragraphs: [
        'For a page design, a useful starting packet could contain the current page, the requested interaction, and the existing visual conventions. Keep a record of the information the assistant asks for or gets wrong.',
        'Then revise the packet using those observations. Add the missing constraint. Remove a stale instruction. Make an important example easier to find. Each revision should have a reason tied to the task.'
      ] },
      { quote: 'What information would change the next decision?' },
      { heading: 'Keep the question open', paragraphs: [
        'One successful attempt does not settle the right amount of context for every task. It gives you a result for one task, with one packet of information. A different task may need a different starting point.',
        'The useful artifact is the pair of input and outcome. Keeping both makes it possible to compare later attempts without relying on memory alone.'
      ] }
    ]
  }
];
