# k6tasks

#### Prerequisites
* docker
* k6 image ( https://docs.k6.io/docs/installation )

#### How to run
```
docker run -i loadimpact/k6 run -< script#.js 
```

### script1
* won_counter = keeps the number of won results

### script2
* users are randomized between calls
* counter_user = keeps the number of user logins
* counter_admin = keeps the number of admin logins
