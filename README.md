[![CircleCI](https://circleci.com/gh/SkeloGH/dragster/tree/master.svg?style=svg)](https://circleci.com/gh/SkeloGH/dragster/tree/master)

# Dragster

A drag racing game based on phaser.js, running on node.

https://dragsterio.herokuapp.com

## How to install/run the app:

1. Clone the project.
2. `cd` into the project.
3. `./install.sh`

It will run the app on port 3000, then you just go to `http://127.0.0.1:3000` and you'll be set!

## Development

For now, during development run `npm run build` before committing changes, this will be automated soon ;) .

## Controls

- [UP arrow] shift up.
- [DOWN arrow] shift down.
- [LEFT arrow] brake.
- [LEFT arrow] accelerate.

Note that you need to shift down for neutral & reverse.

## Implementation so far

- Racing stage: basic elements rendering and gearboxed movement, you actually need to shift up to get the car into 1st gear, so no race, yet.

## Follow up progress

I've setup a board to organize the activities and progress: https://github.com/SkeloGH/dragster/projects/1

## Collab conventions

- branch name should be prefixed by `issue_` and the issue number, e.g.: `issue_3`.
- per the above, no PR if no issue exists.
- commit messages start with a verb: `added`, `removed`, `changed`, `fixed`, `merged`, `solved`, `improved`.
- multiline commits are allowed, so long as they follow the above convention, bulleted.
- Every push to master will deploy a new version of this app. Deploys happen automatically: be sure that this branch in GitHub is always in a deployable state and any tests have passed before you push.
