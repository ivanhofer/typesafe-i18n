name: "\U0001F41E Bug report"
description: Report an issue with `typesafe-i18n`
labels: ["bug"]
body:
  - type: markdown
    attributes:
      value: Thanks for taking the time to fill out this bug report!
  - type: textarea
    id: bug-description
    attributes:
      label: Describe the bug
      description: A clear and concise description of what the bug is. If you intend to submit a PR for this issue, tell us in the description. Thanks!
      placeholder: Bug description
    validations:
      required: true
  - type: textarea
    id: reproduction
    attributes:
      label: Reproduction
      description: Please provide a description and a link to a repo that can reproduce the problem you ran into.
      placeholder: Reproduction
    validations:
      required: true
  - type: textarea
    id: logs
    attributes:
      label: Logs
      description: Please include logs around the time this bug occurred.
      render: shell
  - type: textarea
    id: config
    attributes:
      label: Config
      description: Please include the contents of you `.typesafe-i18n` config file
      render: json
  - type: textarea
    id: additional-info
    attributes:
      label: Additional Info
      description: Additional Context that can help us solve the bug.
      placeholder: used System, Libraries, Browsers
    validations:
      required: true