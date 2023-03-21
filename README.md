# Frogbot Demo

## The Defined Watch From My Jfrog Platform Deployment (JPD)
```json
{
	"general_data": {
		"id": "73edfa9015f68719bad22177",
		"name": "frogbot-test-watch",  <---------
		"active": true
	},
	"project_resources": {
		"resources": [
			{
				"type": "all-builds",
				"name": "All Builds",
				"bin_mgr_id": "default"
			},
			{
				"type": "all-repos",
				"name": "All Repositories",
				"bin_mgr_id": "default"
			}
		]
	},
	"assigned_policies": [
		{
			"name": "frogbot-test-policy", <-------
			"type": "security"
		}
	]
}
```

## The Policy Associated with the Watch:
```json
{
	"name": "frogbot-test-policy",
	"type": "security",
	"author": "tomj@jfrog.com",
	"rules": [
		{
			"name": "CVE-2022-0144",
			"priority": 1,
			"actions": {
				"block_download": {
					"unscanned": false,
					"active": false
				}
			},
			"criteria": {
				"applicable_cves_only": false,
				"fix_version_dependant": false,
				"malicious_package": false,
				"vulnerability_ids": [
					"CVE-2022-0144"
				]
			}
		},
		{
			"name": "CVE-2021-23337",
			"priority": 2,
			"actions": {
				"block_download": {
					"unscanned": false,
					"active": false
				}
			},
			"criteria": {
				"applicable_cves_only": false,
				"fix_version_dependant": false,
				"malicious_package": false,
				"vulnerability_ids": [
					"CVE-2021-23337"
				]
			}
		}
	],
	"created": "2023-03-21T14:48:34.098Z",
	"modified": "2023-03-21T17:06:28.057Z"
}
```

My Frogbot Action definition:
```yaml
name: "Frogbot Scan Pull Request"  
on:  
  pull_request_target:  
    types: [opened, synchronize]  
permissions:  
  pull-requests: write  
  contents: read  
jobs:  
  scan-pull-request:  
    runs-on: ubuntu-latest  
    steps:  
      - name: Checkout  
        uses: actions/checkout@v2  
        with:  
          ref: ${{ github.event.pull_request.head.sha }}  
  
      # Install prerequisites  
      - name: Setup NodeJS  
        uses: actions/setup-node@v3  
        with:  
          node-version: "16.x"  
  
      - name: "Frogbot Scan"  
        uses: jfrog/frogbot@v2  
        env:  
          JF_URL: ${{ secrets.JF_URL }}  
          JF_ACCESS_TOKEN: ${{ secrets.JF_ACCESS_TOKEN }}  
          JF_GIT_TOKEN: ${{ secrets.GITHUB_TOKEN }}  
          JF_INSTALL_DEPS_CMD: npm install  
          JF_WATCHES: "frogbot-test-watch" <----------------
```

[Example PR with No Watch Defined](https://github.com/tomjfrog/frogbot-demo/pull/7), Frogbot using default logic.

[Example PR with Watch Defined](https://github.com/tomjfrog/frogbot-demo/pull/8), Frogbot using The above defined Watch logic.
