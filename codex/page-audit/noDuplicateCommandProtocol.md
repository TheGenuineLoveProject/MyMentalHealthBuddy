# No Duplicate Command Protocol

## Rule
Before running any command, check whether the same phase already completed.

## Safe Order
1. git status --short
2. verify current files
3. create only missing docs
4. run verification once
5. stop

## Do Not Repeat
- do not recreate existing docs
- do not rerun old phases unless verification failed
- do not paste duplicate command blocks
- do not modify runtime unless phase explicitly says runtime
