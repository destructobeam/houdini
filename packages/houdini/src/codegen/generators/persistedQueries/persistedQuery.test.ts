import { test, expect } from 'vitest'

import { runPipeline } from '../../../codegen'
import type { Document } from '../../../lib'
import { fs, path } from '../../../lib'
import { mockCollectedDoc, testConfig } from '../../../test'

test('generates an artifact for every document', async function () {
	const config = testConfig()
	config.persistedQueryPath = path.join(config.rootDir, 'hash.json')

	// the documents to test
	const docs: Document[] = [
		mockCollectedDoc(`query TestQuery1 { version }`),
		mockCollectedDoc(`query TestQuery2 { user { ...TestFragment } }`),
		mockCollectedDoc(`fragment TestFragment on User { firstName }`),
	]
	// execute the generator
	await runPipeline(config, docs)

	expect(JSON.parse((await fs.readFile(config.persistedQueryPath))!)).toMatchInlineSnapshot(`
		{
		    "5ba2c5763a93559769c84d7dd536becf80b4c7be6db9f6af232a4309ebff665c": "query TestQuery1 {\\n  version\\n}",
		    "784a9aa470ac0a05068e3cdbc12365c455e5e708759602dbc8ee0946bb998c26": "query TestQuery2 {\\n  user {\\n    ... on User {\\n      firstName\\n    }\\n    id\\n    ...TestFragment\\n  }\\n}\\n\\nfragment TestFragment on User {\\n  firstName\\n}"
		}
	`)
})
